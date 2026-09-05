import { RubiksLoader } from "@/components/ui/rubiks-loader";

export function ContentLoader({ label = "Loading ACA..." }: { label?: string }) {
  return <RubiksLoader label={label} />;
}
