import Image from "next/image";

async function getContacts() {
  const res = await fetch("http://localhost:8080/api/contacts", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch contacts");
  }

  return res.json();
}

export default async function Home() {
  const contacts = await getContacts();

  return (
    <main style={{ padding: 20 }}>
      <h1>Контакты (Next.js + Spring)</h1>
      <ul>
        {contacts.map((c) => (
          <li key={c.id}>
            {c.firstName} {c.lastName} — {c.email} — {c.phone}
          </li>
        ))}
      </ul>
    </main>
  );
}

