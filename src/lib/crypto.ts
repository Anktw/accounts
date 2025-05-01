// This is a simplified version for demonstration purposes
//This is not a secure implementation...
// I dont know how to do this properly, so I will use this for now
export async function encrypt(data: any): Promise<string> {
    return Buffer.from(JSON.stringify(data)).toString("base64")
  }
  
  export async function decrypt(encryptedData: string): Promise<any> {
    try {
      const decrypted = Buffer.from(encryptedData, "base64").toString()
      return JSON.parse(decrypted)
    } catch (error) {
      console.error("Decryption error:", error)
      return null
    }
  }
  