import { FileStorageClient } from '@giga/file-storage-sdk'

export const fileStorage = new FileStorageClient({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_ANON_KEY!,
})
