import { IconWhatsapp } from "./icons";

const WHATSAPP_URL = "https://wa.me/258841031220";

export function WhatsappFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener"
      className="whatsapp-float"
      aria-label="WhatsApp"
    >
      <IconWhatsapp width={28} height={28} color="white" />
    </a>
  );
}
