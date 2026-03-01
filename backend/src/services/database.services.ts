import { connectDB } from '~/config/index.js'

class DatabaseService {
  async connect() {
    await connectDB()
  }
}

const databaseService = new DatabaseService()
export default databaseService
