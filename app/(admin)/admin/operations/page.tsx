import { InfoCard } from "@/components/system/InfoCard";
import { SurfaceShell } from "@/components/system/SurfaceShell";
import { getAdminOperationsSnapshot } from "@/lib/supabase/queries/admin";

export default async function AdminOperationsPage() {
  const operations = await getAdminOperationsSnapshot();

  return (
    <SurfaceShell
      eyebrow="Founder Operations"
      title="Operational Visibility."
      description="This route shows recent operational records so founder/admin can spot launch issues, notification failures, and billing anomalies without leaving the app."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <InfoCard title="Status History" description="Recent account-state changes.">
          <div className="space-y-3 text-sm text-muted">
            {operations.statusHistory.map((entry) => (
              <div key={entry.id}>
                <p className="text-white">{entry.to_state}</p>
                <p>{entry.reason ?? "No reason recorded."}</p>
              </div>
            ))}
          </div>
        </InfoCard>
        <InfoCard title="Notifications" description="Recent notification delivery rows.">
          <div className="space-y-3 text-sm text-muted">
            {operations.notificationEvents.map((event) => (
              <div key={event.id}>
                <p className="text-white">{event.type}</p>
                <p>{event.status} via {event.provider}</p>
              </div>
            ))}
          </div>
        </InfoCard>
        <InfoCard title="Payments" description="Recent payment rows for audit visibility.">
          <div className="space-y-3 text-sm text-muted">
            {operations.payments.map((payment) => (
              <div key={payment.id}>
                <p className="text-white">
                  ${(payment.amount_cents / 100).toFixed(2)} {payment.currency.toUpperCase()}
                </p>
                <p>{payment.payment_status}</p>
              </div>
            ))}
          </div>
        </InfoCard>
      </div>
    </SurfaceShell>
  );
}
