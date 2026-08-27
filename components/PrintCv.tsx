import { education, profile, skillList, work } from "@/lib/content";

export function PrintCv() {
  return (
    <section className="print-cv" aria-hidden="true">
      <h2>Curriculum</h2>
      <p>
        {profile.name} · {profile.role} · {profile.city}, {profile.country}
      </p>
      <p>
        {profile.email} · {profile.phone} · {profile.lat} · {profile.lon}
      </p>
      <h3>Work</h3>
      {work.map((item) => (
        <div key={item.id}>
          <p>
            <strong>
              {item.org} — {item.title}
            </strong>
          </p>
          <p>{item.dates}</p>
          <p>{item.body}</p>
        </div>
      ))}
      <h3>School</h3>
      {education.map((item) => (
        <div key={item.id}>
          <p>
            <strong>
              {item.org} — {item.title}
            </strong>
          </p>
          <p>{item.dates}</p>
          <p>{item.body}</p>
        </div>
      ))}
      <h3>Tools</h3>
      <p>{skillList.join(" · ")}</p>
    </section>
  );
}
