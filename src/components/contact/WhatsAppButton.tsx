import { Button, Icon } from "@/components/ui";
import { site } from "@/data/site";
import { env } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/contact";

interface WhatsAppButtonProps {
  className?: string;
}

/**
 * Click-to-chat button. The link is built by buildWhatsAppUrl (wa.me + URL-encoded pre-filled
 * message) from VITE_WHATSAPP_NUMBER, so no phone number lives in the source. On phones it opens
 * the WhatsApp app, on computers WhatsApp Web / Desktop. Renders nothing when no usable number
 * is configured.
 */
export default function WhatsAppButton({ className }: WhatsAppButtonProps) {
  const href = buildWhatsAppUrl(env.whatsappNumber, site.contact.whatsappMessage);
  if (!href) return null;

  return (
    <Button
      href={href}
      external
      variant="whatsapp"
      className={className}
      icon={<Icon name="whatsapp" size={16} />}
      aria-label="Chat on WhatsApp: message Alvin directly (opens in a new tab)"
    >
      Chat on WhatsApp
    </Button>
  );
}
