import Image from "next/image";

const CONTACT_URL = "https://www.linkedin.com/in/craigtracey";

const projects = [
  {
    name: "SixDegree",
    category: "Enterprise AI",
    description: "Shared business context for people and AI agents.",
    detail: "SixDegree connects records across CRM, support, billing, product, and engineering systems. It resolves entities and relationships into an operational graph, with sources, history, and access controls attached to the answers.",
    tags: ["Context engineering", "Operational graphs", "Agents"],
    url: "https://sixdegree.ai",
    domain: "sixdegree.ai",
    className: "sixdegree",
  },
  {
    name: "Deft",
    category: "Applied AI",
    description: "Preparation, live guidance, and review for customer calls.",
    detail: "Deft brings customer context and an editable talk track into a call, offers live guidance in a desktop app alongside Zoom, and helps review what changed afterward. Proposed updates stay linked to their source for the user to accept, edit, or dismiss.",
    tags: ["Conversation intelligence", "Customer context", "Live guidance"],
    url: "https://deft.io",
    domain: "deft.io",
    className: "deft",
  },
];

const companies = [
  { name: "VMware", logo: "/logos/vmware-trimmed.png", wordmark: true },
  { name: "HubSpot", logo: "/logos/hubspot-trimmed.png", wordmark: false },
  { name: "IBM", logo: "/logos/ibm-trimmed.png", wordmark: true },
  { name: "Heptio", logo: "/logos/heptio-trimmed.png", wordmark: true },
  { name: "Blue Box", logo: "/logos/blue-box-trimmed.png", wordmark: true },
  { name: "Carbonite", logo: "/logos/carbonite-trimmed.png", wordmark: true },
  { name: "Computer Associates", logo: "/logos/computer-associates-trimmed.png", wordmark: true },
  { name: "Stratus", logo: "/logos/stratus-trimmed.png", wordmark: true },
  { name: "Netezza", logo: "/logos/netezza-trimmed.png", wordmark: true },
];

const expertise = [
  { title: "AI systems", text: "LLM applications, agents, retrieval, and evaluation. I work on the application logic, model integration, and infrastructure needed to run them.", tags: "Agents · Retrieval · Evals · Automation" },
  { title: "Infrastructure & platforms", text: "Cloud architecture, distributed systems, deployment, and observability. My background includes building platforms and operating production infrastructure.", tags: "Cloud · Platforms · Reliability · Operations" },
  { title: "Product & enterprise", text: "I’ve founded companies, built products, and worked directly with enterprise customers through technical sales, implementation, and delivery.", tags: "Product · Technical sales · Enterprise delivery" },
];

const climb = [
  { year: "2023", layer: "Developer platforms", where: "Arctir · Backstage, Devgraph" },
  { year: "2017", layer: "Kubernetes", where: "Heptio / VMware · Cluster API" },
  { year: "2012", layer: "OpenStack & bare metal", where: "Blue Box / IBM · HubSpot" },
  { year: "2007", layer: "Hypervisor networking", where: "VMware · ESX / vSphere" },
  { year: "1999", layer: "Linux kernel & drivers", where: "Stratus · Netezza" },
];

function ProjectBrand({ name }: { name: string }) {
  const isSixDegree = name === "SixDegree";
  return (
    <span className={`project-brand ${isSixDegree ? "brand-sixdegree" : "brand-deft"}`}>
      {isSixDegree && <Image src="/logos/sixdegree.svg" alt="" width={36} height={36} unoptimized />}
      <span className="brand-wordmark">{isSixDegree ? <><span>six</span><span className="brand-blue">degree</span></> : <>deft<span className="brand-lime">.</span></>}</span>
    </span>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header shell">
        <a href="#" className="wordmark" aria-label="Craig Tracey home">craigtracey<span>.</span></a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#experience">Experience</a><a href="#about">About</a></nav>
        <a className="header-contact" href="#contact">Consulting</a>
      </header>
      <main id="main">
        <section className="hero hero-personal shell" aria-labelledby="hero-title">
          <div className="hero-main">
            <h1 id="hero-title">Founder.<br />Engineer.<br /><em>Across the stack.</em></h1>
            <div className="hero-intro">
              <Image src="/images/craig-tracey.webp" alt="" width={48} height={48} loading="eager" unoptimized />
              <p className="hero-description">I’m Craig Tracey. I build <strong>AI systems, infrastructure, and software.</strong> I’ve founded companies and sold and delivered to some of the world’s largest enterprises.</p>
            </div>
            <div className="hero-actions"><a className="button" href="#work">Explore my work</a><a className="text-link" href={CONTACT_URL}>Get in touch</a></div>
          </div>
          <aside className="hero-climb" aria-labelledby="climb-title">
            <p id="climb-title" className="climb-label">25 years, up the stack</p>
            <ol>
              <li className="climb-now">
                <span className="climb-year">Now</span>
                <span className="climb-body">
                  <strong>AI agents &amp; business context</strong>
                  <span className="climb-projects">
                    {projects.map(project => (
                      <a key={project.name} href={project.url}><span className="sr-only">{project.name}</span><span aria-hidden="true"><ProjectBrand name={project.name} /></span><span aria-hidden="true">↗</span></a>
                    ))}
                  </span>
                </span>
              </li>
              {climb.map(step => (
                <li key={step.year}>
                  <span className="climb-year">{step.year}</span>
                  <span className="climb-body"><strong>{step.layer}</strong><span>{step.where}</span></span>
                </li>
              ))}
            </ol>
          </aside>
          <dl className="hero-proof" aria-label="Career milestones">
            <div><dd>25+</dd><dt>Years</dt></div>
            <div><dd>4</dd><dt>IPOs</dt></div>
            <div><dd>2</dd><dt>Acquisitions</dt></div>
            <div className="proof-book"><dt>Co-author of</dt><dd><a href="https://www.oreilly.com/library/view/managing-kubernetes/9781492033905/">Managing Kubernetes</a>, O’Reilly</dd></div>
          </dl>
        </section>

        <section className="introduction shell" aria-labelledby="intro-title">
          <h2 id="intro-title">From the code<br /><span>to the customer.</span></h2>
          <div className="intro-copy"><p>My experience spans every layer of the stack, from infrastructure and platforms to applications and AI. I’ve founded companies, written the code, and sold and delivered to some of the largest companies in the world.</p><p>I work across architecture, implementation, technical sales, and customer delivery. I’m comfortable writing code and working through requirements with a customer’s engineering team.</p></div>
        </section>

        <section id="work" className="work section shell" aria-labelledby="work-title">
          <div className="section-heading"><div><h2 id="work-title">Selected projects<span>.</span></h2></div><p>A few things I’ve been building.</p></div>
          <div className="project-grid">{projects.map((project) => (
            <article className="project" key={project.name}>
              <a className={`project-banner ${project.className}`} href={project.url} aria-label={`Visit ${project.name}`}><Image src={`/images/${project.className}.webp`} alt={`${project.name} website showing the product`} width={1200} height={project.className === "sixdegree" ? 667 : 608} loading="lazy" unoptimized /></a>
              <div className="project-body"><h3><span className="sr-only">{project.name}</span><span aria-hidden="true"><ProjectBrand name={project.name} /></span></h3><p className="project-description">{project.description}</p><div className="tags">{project.tags.map(tag=><span key={tag}>{tag}</span>)}</div><p className="project-detail">{project.detail}</p><a className="project-visit text-link" href={project.url}>Visit {project.domain}</a></div>
            </article>
          ))}</div>
        </section>

        <section id="experience" className="experience section shell" aria-labelledby="experience-title">
          <div className="section-heading"><div><h2 id="experience-title">Where I’ve worked<span>.</span></h2></div><p>Infrastructure, platforms, and enterprise software.</p></div>
          <ul className="company-list">{companies.map(company => <li key={company.name}><span className="company-mark">{company.logo && <Image src={company.logo} alt={company.wordmark ? company.name : ""} width={160} height={50} unoptimized loading="lazy" />}{!company.wordmark && <span>{company.name}</span>}</span></li>)}</ul>
        </section>

        <section id="expertise" className="expertise section" aria-labelledby="expertise-title"><div className="shell"><div className="section-heading"><div><h2 id="expertise-title">Areas of focus<span>.</span></h2></div><p>AI, infrastructure, and enterprise software.</p></div><div className="expertise-grid">{expertise.map(item=><article key={item.title}><div className="expertise-rule" /><h3>{item.title}</h3><p>{item.text}</p><span className="expertise-tags">{item.tags}</span></article>)}</div></div></section>

        <section id="about" className="about section shell" aria-labelledby="about-title"><div><h2 id="about-title">I stay close<br /><span>to the work.</span></h2><a className="text-link" href="https://github.com/craigtracey">Find me on GitHub</a></div><div className="about-copy"><p className="large-copy">I’m a founder who writes code.</p><p>I’ve worked at every layer of the stack, from cloud platforms and distributed infrastructure to applications and AI. I’ve also been responsible for selling that work and delivering it to enterprise customers.</p><p>That means thinking about more than implementation: how a system will be deployed, who will operate it, what it costs, and whether it solves the customer’s problem.</p></div></section>

        <section className="writing section shell" aria-labelledby="writing-title">
          <div><h2 id="writing-title">Managing Kubernetes<span>.</span></h2></div>
          <div className="book-feature">
            <a className="book-cover" href="https://www.oreilly.com/library/view/managing-kubernetes/9781492033905/" aria-label="View Managing Kubernetes on O’Reilly"><Image src="/images/managing-kubernetes.jpg" alt="Managing Kubernetes by Brendan Burns and Craig Tracey, published by O’Reilly" width={500} height={656} loading="lazy" unoptimized /></a>
            <div className="book-copy"><h3>Operating Kubernetes in production</h3><p>Co-authored with Brendan Burns. A guide to Kubernetes architecture, cluster operations, and maintenance.</p><a className="text-link" href="https://www.oreilly.com/library/view/managing-kubernetes/9781492033905/">View the book</a></div>
          </div>
        </section>

        <section id="contact" className="contact shell" aria-labelledby="contact-title">
          <div className="contact-inner">
            <h2 id="contact-title">Enterprise rollout <em>reviews.</em></h2>
            <div className="contact-bottom">
              <div className="consulting-copy">
                <p>I consult with teams taking AI and infrastructure products from pilot to production. If a customer is ready to roll out and you’re unsure what it will take, I can review the plan with your engineers.</p>
                <p>Bring your architecture, the customer’s requirements, and the decisions holding up launch. I’ll put together a written assessment of the risks and a prioritized plan your team can use to ship.</p>
              </div>
              <a className="button" href={CONTACT_URL}>Message me on LinkedIn</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer shell"><a className="wordmark" href="#">craigtracey<span>.</span></a><p>© {new Date().getFullYear()} Craig Tracey</p><nav aria-label="Social links"><a href="https://github.com/craigtracey">GitHub</a><a href="https://www.linkedin.com/in/craigtracey">LinkedIn</a><a href={CONTACT_URL}>Contact</a></nav></footer>
    </>
  );
}
