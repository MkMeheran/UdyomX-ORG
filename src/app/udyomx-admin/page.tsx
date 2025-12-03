import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const ADMIN_EMAIL = 'mdmokammelmorshed@gmail.com';

export default function HiddenAdminPage() {
    // Check if already logged in as admin
    const cookieStore = cookies();
    const adminSession = cookieStore.get('admin-session');
    
    if (adminSession) {
        try {
            const session = JSON.parse(adminSession.value);
            if (session.email === ADMIN_EMAIL) {
                // Already logged in as admin
                redirect('/dashboard/admin');
            }
        } catch {
            // Invalid session, continue to login
        }
    }
    
    // Redirect to Google OAuth with admin flag
    redirect('/auth/google?admin=true');
}
