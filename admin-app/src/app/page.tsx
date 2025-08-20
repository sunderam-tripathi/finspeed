import { redirect } from 'next/navigation';

export default function AdminHomePage() {
  // Admin app only shows admin interface
  redirect('/admin');
}
