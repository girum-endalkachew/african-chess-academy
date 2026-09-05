import { RubiksLoader } from "@/components/ui/rubiks-loader";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center canvas-bg">
      <RubiksLoader label="Loading African Chess Academy..." />
    </div>
  );
}
