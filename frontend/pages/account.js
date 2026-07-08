import Link from 'next/link';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, loading } = useAuth();
  const membership = user?.membership;
  const plan = membership?.membership;

  if (loading) return <div className="page min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  if (!user) return (
    <div className="page min-h-screen flex items-center justify-center text-center" style={{ paddingTop: 130 }}>
      <div data-aos="fade-up">
        <h1 className="text-2xl font-bold mb-4">Sign in to view your account</h1>
        <Link href="/login" className="btn">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ paddingTop: 130 }}>
      <section className="max-w-3xl mx-auto" data-aos="fade-up">
        <h1 className="font-poppins text-4xl font-bold mb-2">My Account</h1>
        <p className="opacity-60 mb-10">Welcome back, {user.name}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <GlassCard>
            <h2 className="font-poppins text-lg font-bold mb-1">Profile</h2>
            <p className="text-sm opacity-60">{user.email}</p>
            {user.phone && <p className="text-sm opacity-60">{user.phone}</p>}
            <p className="text-sm opacity-60 capitalize">{user.role}</p>
          </GlassCard>

          <GlassCard>
            <h2 className="font-poppins text-lg font-bold mb-1">Membership</h2>
            {plan ? (
              <>
                <p className="text-sm font-semibold text-[#d071c7]">{plan.name}</p>
                <p className="text-xs opacity-60">Active until {new Date(membership.end_date).toLocaleDateString('en-GB')}</p>
              </>
            ) : (
              <>
                <p className="text-sm opacity-60 mb-3">No active membership</p>
                <Link href="/memberships" className="btn text-sm !py-2 !px-4">View Plans</Link>
              </>
            )}
          </GlassCard>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <GlassCard>
            <h2 className="font-poppins text-lg font-bold mb-1">Bookings</h2>
            <p className="text-sm opacity-60">View your upcoming and past sessions.</p>
            <Link href="/my-bookings" className="btn text-sm !py-2 !px-4 mt-4 inline-block">View Bookings</Link>
          </GlassCard>
          <GlassCard>
            <h2 className="font-poppins text-lg font-bold mb-1">Book a Session</h2>
            <p className="text-sm opacity-60">Browse upcoming events and book your spot.</p>
            <Link href="/events" className="btn text-sm !py-2 !px-4 mt-4 inline-block">Browse Events</Link>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
