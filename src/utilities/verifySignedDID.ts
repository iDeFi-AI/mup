// mup/src/utilities/verifySignedDID.ts

export async function verifySignedData(jwt: string) {
  try {
    // Dynamically import 'did-jwt' instead of using static import
    const { verifyJWT } = await import('did-jwt');
    
    const verified = await verifyJWT(jwt);
    console.log('Verified JWT:', verified);
  } catch (error) {
    console.error('Failed to verify JWT:', error);
  }
}
