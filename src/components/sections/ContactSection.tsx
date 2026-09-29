import type { IconName } from "@/types";
import { Card, Icon, Reveal, Section, SectionHeading } from "@/components/ui";
import { ContactForm, WhatsAppButton } from "@/components/contact";
import { site } from "@/data/site";
import { env } from "@/lib/constants";
import { buildWhatsAppUrl } from "@/lib/contact";
import styles from "./ContactSection.module.css";

interface ContactLink {
  id: string;
  icon: IconName;
  label: string;
  value: string;
  href: string;
  external: boolean;
}

/**
 * Contact section: copy and links on the left, the form (components/contact/ContactForm) on the right.
 * The Formspree endpoint and WhatsApp number come from the environment (see .env.example);
 * without a usable number the WhatsApp button is simply left out.
 */
export default function ContactSection() {
  const { contact, availability, socials } = site;
  const whatsappUrl = buildWhatsAppUrl(env.whatsappNumber, contact.whatsappMessage);

  const links: ContactLink[] = [];
  // The email row exists only when VITE_CONTACT_EMAIL is set, so no placeholder address is ever shown.
  if (contact.email) {
    links.push({ id: "email", icon: "mail", label: "Email", value: contact.email, href: `mailto:${contact.email}`, external: false });
  }
  for (const s of socials) {
    // Only the socials that have a readable profile address (github, linkedin) are listed here.
    if (s.displayText) {
      links.push({ id: s.id, icon: s.icon, label: s.label, value: s.displayText, href: s.href, external: true });
    }
  }

  return (
    <Section id="contact" background="secondary" labelledBy="contact-heading">
      <SectionHeading id="contact-heading" number={7} title="Get in Touch" />

      <p className={styles.availability} data-available={availability.isAvailable}>
        <span className={styles.dot} aria-hidden="true" />
        {availability.isAvailable ? availability.labels.contact : availability.labels.unavailable}
      </p>

      <div className={styles.grid}>
        <Reveal direction="left">
          <p className={styles.intro}>{contact.intro}</p>
          {/* The fastest route: opens a WhatsApp chat with the message already written. */}
          {whatsappUrl && (
            <div className={styles.whatsapp}>
              <WhatsAppButton />
            </div>
          )}
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.id}>
                <a
                  className={styles.link}
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className={styles.linkIcon}>
                    <Icon name={link.icon} size={20} />
                  </span>
                  <span className={styles.linkText}>
                    <span className={styles.linkLabel}>{link.label}</span>
                    <span className={styles.linkValue}>{link.value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal direction="right">
          <Card interactive={false}>
            <ContactForm
              endpoint={env.formspreeEndpoint}
              topics={contact.topics}
              copy={contact.form}
              whatsappUrl={whatsappUrl}
            />
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
