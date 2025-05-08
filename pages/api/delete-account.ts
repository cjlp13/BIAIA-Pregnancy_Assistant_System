import { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from "@/lib/supabase/adminClient" 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {  // Ensure this is checking DELETE
    const { user_id } = req.body
    
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    try {
      // Delete data from related tables
      await supabaseAdmin.from('profiles').delete().eq('user_id', user_id)
      await supabaseAdmin.from('appointments').delete().eq('user_id', user_id)
      await supabaseAdmin.from('journal_entries').delete().eq('user_id', user_id)

      // Delete user from authentication
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user_id)

      if (error) {
        throw new Error(`Error deleting user: ${error.message}`)
      }

      res.status(200).json({ message: 'Account deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete account' })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}

