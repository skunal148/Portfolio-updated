import { db } from '../firebaseConfig';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { Portfolio } from '../types';

const PORTFOLIOS_COLLECTION = 'portfolios';

// Get all portfolios for a user
export const getUserPortfolios = async (userId: string): Promise<Portfolio[]> => {
  try {
    const portfoliosRef = collection(db, PORTFOLIOS_COLLECTION);
    const q = query(
      portfoliosRef, 
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc') // Using updatedAt to match existing Firestore index
    );
    
    const querySnapshot = await getDocs(q);
    const portfolios: Portfolio[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      portfolios.push({
        id: doc.id,
        ...data,
        lastModified: data.lastModified?.toMillis?.() || data.lastModified || Date.now()
      } as Portfolio);
    });
    
    return portfolios;
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    throw error;
  }
};

// Create a new portfolio
export const createPortfolio = async (userId: string, portfolio: Portfolio): Promise<void> => {
  try {
    const portfolioRef = doc(db, PORTFOLIOS_COLLECTION, portfolio.id);
    const now = Timestamp.now();
    await setDoc(portfolioRef, {
      ...portfolio,
      userId,
      lastModified: Timestamp.fromMillis(portfolio.lastModified),
      updatedAt: now,
      createdAt: now
    });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    throw error;
  }
};

// Update an existing portfolio
export const updatePortfolio = async (userId: string, portfolio: Portfolio): Promise<void> => {
  try {
    const portfolioRef = doc(db, PORTFOLIOS_COLLECTION, portfolio.id);
    const now = Timestamp.now();
    await updateDoc(portfolioRef, {
      ...portfolio,
      userId,
      lastModified: Timestamp.fromMillis(Date.now()),
      updatedAt: now
    });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw error;
  }
};

// Delete a portfolio
export const deletePortfolio = async (portfolioId: string): Promise<void> => {
  try {
    const portfolioRef = doc(db, PORTFOLIOS_COLLECTION, portfolioId);
    await deleteDoc(portfolioRef);
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    throw error;
  }
};

// Get a single portfolio by ID
export const getPortfolio = async (portfolioId: string): Promise<Portfolio | null> => {
  try {
    const portfolioRef = doc(db, PORTFOLIOS_COLLECTION, portfolioId);
    const portfolioDoc = await getDoc(portfolioRef);
    
    if (portfolioDoc.exists()) {
      const data = portfolioDoc.data();
      return {
        id: portfolioDoc.id,
        ...data,
        lastModified: data.lastModified?.toMillis?.() || data.lastModified || Date.now()
      } as Portfolio;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

// Migrate localStorage data to Firestore (one-time migration helper)
export const migrateLocalStorageToFirestore = async (userId: string): Promise<void> => {
  try {
    const localData = localStorage.getItem(`folios_v2_${userId}`);
    if (!localData) return;
    
    const portfolios: Portfolio[] = JSON.parse(localData);
    
    // Upload each portfolio to Firestore
    const uploadPromises = portfolios.map(portfolio => 
      createPortfolio(userId, portfolio)
    );
    
    await Promise.all(uploadPromises);
    
    // Optionally clear localStorage after successful migration
    // localStorage.removeItem(`folios_v2_${userId}`);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Error migrating data:', error);
    throw error;
  }
};
