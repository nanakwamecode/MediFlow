import { getInitials } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types";

interface Props {
  patient: Patient;
}

export default function PatientDetailHeader({ patient }: Props) {
  const fields = [
    patient.opdNumber && `🏷 ${patient.opdNumber}`,
    patient.age && `Age ${patient.age}`,
    patient.gender,
    patient.phone && `📞 ${patient.phone}`,
    patient.town && `📍 ${patient.town}`,
    patient.dob && `Born ${patient.dob}`,
  ].filter(Boolean);

  return (
    <div className="mb-5 rounded-xl bg-ink p-6 text-white shadow-lg">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-full",
            "bg-accent/25 font-serif text-2xl text-red-300"
          )}
        >
          {getInitials(patient.name)}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-3xl tracking-tight text-white">
            {patient.name}
          </h1>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            {fields.map((f, i) => (
              <span
                key={i}
                className="font-mono text-[0.65rem] text-white/50"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {patient.notes && (
        <div className="mt-3 border-t border-white/8 pt-3">
          <div className="font-mono text-[0.52rem] tracking-[0.2em] text-white/25 uppercase">
            Medical Notes
          </div>
          <div className="mt-1 text-[0.75rem] leading-relaxed text-white/50">
            {patient.notes}
          </div>
        </div>
      )}
    </div>
  );
}
