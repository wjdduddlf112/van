(function () {
  const content = window.eventContent;
  if (!content) return;

  const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));

  const setText = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };

  const setHtml = (selector, value, root = document) => {
    const element = root.querySelector(selector);
    if (element) element.innerHTML = value;
  };

  const setAttr = (selector, attribute, value) => {
    const element = document.querySelector(selector);
    if (element) element.setAttribute(attribute, value);
  };

  const factHtml = (facts, usePrintTime) => facts.map((fact) => {
    const detail = usePrintTime && fact.printDetail ? fact.printDetail : fact.detail;
    return `<div class="fact"><div class="fl">${esc(fact.label)}</div><div class="fv">${esc(fact.value)}<small>${esc(detail)}</small></div></div>`;
  }).join("");

  const indexFactHtml = (facts) => facts.map((fact) => `
        <div class="fact">
          <div class="fl">${esc(fact.label)}</div>
          <div class="fv">${esc(fact.value)} <small>${esc(fact.detail)}</small></div>
        </div>`).join("");

  const indexPillarHtml = (pillars) => pillars.map((pillar) => `<div class="p"><div class="pn">${esc(pillar.number)}</div><div class="pt">${esc(pillar.title)}</div><div class="pd">${esc(pillar.description)}</div></div>`).join("");

  const printPillarHtml = (pillars) => pillars.map((pillar) => `<div class="pillar"><div class="pn">${esc(pillar.number)}</div><div class="pt">${esc(pillar.title)}</div><div class="pd">${esc(pillar.description)}</div></div>`).join("");

  const indexTimelineHtml = (schedule) => schedule.map((item) => {
    const keyClass = item.key ? " key" : "";
    const tag = item.tag ? `<span class="tl-tag">${esc(item.tag)}</span>` : "";
    const detail = item.detail ? `<div class="d">${esc(item.detail)}</div>` : "";
    return `
      <div class="tl-row${keyClass} reveal in" style="transition-delay: 160ms;">
        <div class="tl-time">${esc(item.time)}</div>
        <div class="tl-body${keyClass}">${tag}<div class="t">${esc(item.title)}</div>${detail}</div>
      </div>`;
  }).join("");

  const printTimelineHtml = (schedule) => schedule.map((item) => {
    const keyClass = item.key ? " key" : "";
    const detail = item.detail ? `<small>${esc(item.detail)}</small>` : "";
    return `<div class="tl${keyClass}"><div class="time">${esc(item.printTime || item.time)}</div><div class="event"><b>${esc(item.title)}</b>${detail}</div></div>`;
  }).join("");

  const metaHtml = (items, className) => items.map((item) => (
    `<div${className ? ` class="${className}"` : ""}><span class="ml">${esc(item.label)}</span><span class="mv">${esc(item.value)}</span></div>`
  )).join("");

  const peopleHtml = (people, includeSessionLine, sessionLabel) => people.map((person) => {
    const session = includeSessionLine ? `<br><span class="session-line">${esc(sessionLabel)}</span>` : "";
    const detail = person.detail ? `<br>${esc(person.detail)}` : "";
    return `
            <div class="person">
              <div class="pname">${esc(person.name)}<span class="tag">${esc(person.tag)}</span></div>
              <div class="pinfo"><span class="lead">${esc(person.lead)}</span>${session}${detail}</div>
            </div>`;
  }).join("");

  const printPeopleHtml = (people, includeSessionLine, sessionLabel) => people.map((person) => {
    const session = includeSessionLine ? `<br><span class="session-line">${esc(sessionLabel)}</span>` : "";
    const detail = person.detail ? `<br>${esc(person.detail)}` : "";
    return `<div class="person"><div class="pname">${esc(person.name)}<span class="tag">${esc(person.tag)}</span></div><div class="pinfo"><span class="lead">${esc(person.lead)}</span>${session}${detail}</div></div>`;
  }).join("");

  const supportClass = (item) => ["name", item.long ? "long" : "", item.en ? "en" : ""].filter(Boolean).join(" ");

  const indexSupportHtml = (items) => items.map((item) => `
        <div class="support-logo">
          <div class="role">${esc(item.role)}</div>
          <div class="${supportClass(item)}">${esc(item.name)}</div>
        </div>`).join("");

  const printSupportHtml = (items) => items.map((item) => `<div class="sponsor-logo-print"><div class="role">${esc(item.role)}</div><div class="${supportClass(item)}">${esc(item.name)}</div></div>`).join("");

  const setSession = (article, session, className) => {
    if (!article) return;
    setText("h3", session.title, article);
    setHtml(".meta, .s-meta", metaHtml([
      { label: "Format", value: session.format },
      { label: "Time", value: session.time },
      { label: session.participantLabel, value: session.participantSummary }
    ], className), article);
    const desc = session.disclaimer ? `${esc(session.description)}<br><br><span class="session-line">${esc(session.disclaimer)}</span>` : esc(session.description);
    setHtml(".desc, .s-desc", desc, article);
  };

  const setDiscussion = (article, session, className) => {
    if (!article) return;
    setText("h3", session.title, article);
    setHtml(".meta, .s-meta", metaHtml([
      { label: "Format", value: session.format },
      { label: "Time", value: session.time },
      { label: "Topic", value: session.topic },
      { label: "Host", value: session.host }
    ], className), article);
    setText(".desc, .s-desc", session.description, article);
  };

  const setNetworking = (article, session, className, printMode) => {
    if (!article) return;
    setText("h3", printMode ? session.displayTitle : session.displayTitle, article);
    setHtml(".meta, .s-meta", metaHtml([
      { label: "Format", value: session.format },
      { label: "Host", value: session.host },
      { label: "Participants", value: session.participants },
      { label: "Alumni", value: session.alumniSummary }
    ], className), article);
    setText(".desc, .s-desc", session.description, article);
    setHtml(".roster", printMode ? printPeopleHtml(session.alumni, false) : peopleHtml(session.alumni, false), article);
  };

  const renderSharedHead = () => {
    document.title = `${content.event.title} · ${content.event.englishTitle}`;
    setAttr('meta[property="og:title"]', "content", `${content.event.title} · ${content.event.englishTitle}`);
    setAttr('meta[property="og:description"]', "content", `${content.event.audienceFull}을 위한 VAN 2026 Conference`);
  };

  const renderIndex = () => {
    renderSharedHead();
    setHtml(".hero .meta", content.event.meta);
    setHtml(".hero .kicker", `${esc(content.event.hostPrefix)} <span class="van-tag">VAN</span>`);
    setHtml(".hero h1", `${esc(content.event.titlePrefix)}<br><em>${esc(content.event.titleEmphasis)}</em>${esc(content.event.titleSuffix)}`);
    setText(".hero .subtitle", content.event.englishTitle);
    setHtml(".hero-facts", indexFactHtml(content.heroFacts));
    setHtml(".overview .lede", `${esc(content.overview.ledeBefore)}<br class="lede-break"><em>「${esc(content.event.shortTitle)}」</em>${esc(content.overview.ledeAfter)}`);
    setText(".overview .body", content.overview.body);
    setHtml(".overview .pillars", indexPillarHtml(content.overview.pillars));
    setHtml(".program .timeline", indexTimelineHtml(content.schedule));

    const sessionArticles = document.querySelectorAll(".sessions article.session");
    setSession(sessionArticles[0], content.sessions.technology, "m");
    setHtml(".roster", peopleHtml(content.sessions.technology.speakers, true, content.sessions.technology.label), sessionArticles[0]);
    setSession(sessionArticles[1], content.sessions.politics, "m");
    setHtml(".roster", peopleHtml(content.sessions.politics.speakers, false), sessionArticles[1]);
    setText("[data-politics-note]", content.sessions.politics.speakerNote, sessionArticles[1]);
    setDiscussion(sessionArticles[2], content.sessions.discussion, "m");
    setNetworking(sessionArticles[3], content.sessions.networking, "m", false);

    setText(".venue-place", content.venue.place);
    setText(".venue-address", content.venue.address);
    setText(".venue-desc", content.venue.description);
    document.querySelectorAll(".transit-list .transit-item span:last-child").forEach((item, index) => {
      item.textContent = content.venue.transit[index] || item.textContent;
    });

    setHtml(".support-grid", indexSupportHtml(content.supportOrganizations));
    setText(".closing .right", "");
    setHtml(".closing .right", `${esc(content.event.shortTitle)}<br><em>${esc(content.event.closingLine)}</em>`);
    setText(".contact-copy h3", content.contact.title);
    setText(".contact-copy p", content.contact.description);
    const emailLink = document.querySelector('.contact-list a[href^="mailto:"]');
    if (emailLink) {
      emailLink.textContent = content.contact.email;
      emailLink.setAttribute("href", `mailto:${content.contact.email}`);
    }
    setText(".notice-small", content.contact.notice);
  };

  const renderPrint = () => {
    setHtml(".cover-meta", content.event.meta);
    setText(".cover-title .eyebrow", content.event.host);
    setHtml(".cover-title h1", `${esc(content.event.titlePrefix)}<br><em>${esc(content.event.titleEmphasis)}</em>${esc(content.event.titleSuffix)}`);
    setText(".cover-title .subtitle", content.event.englishTitle);
    setHtml(".facts", factHtml(content.heroFacts, true));
    setHtml(".lede", `${esc(content.overview.ledeBefore)} <em>「${esc(content.event.shortTitle)}」</em>${esc(content.overview.ledeAfter)}`);
    setText(".body-copy", content.overview.body);
    setHtml(".pillars", printPillarHtml(content.overview.pillars));
    setHtml(".timeline", printTimelineHtml(content.schedule));

    const pages = document.querySelectorAll(".page");
    const sessionPageArticles = pages[3].querySelectorAll("article.session");
    setSession(sessionPageArticles[0], content.sessions.technology, "");
    setSession(sessionPageArticles[1], content.sessions.politics, "");
    setHtml(".roster", printPeopleHtml(content.sessions.technology.speakers, true, content.sessions.technology.label), pages[4]);
    setHtml(".roster", printPeopleHtml(content.sessions.politics.speakers, false), pages[5]);
    setText("[data-politics-note]", content.sessions.politics.speakerNote, pages[5]);

    const networkArticles = pages[6].querySelectorAll("article.session");
    setDiscussion(networkArticles[0], content.sessions.discussion, "");
    setNetworking(networkArticles[1], content.sessions.networking, "", true);

    setText(".venue-copy h3", content.venue.place);
    const venueParagraphs = document.querySelectorAll(".venue-copy p");
    if (venueParagraphs[0]) venueParagraphs[0].textContent = content.venue.address;
    if (venueParagraphs[1]) venueParagraphs[1].textContent = content.venue.description;
    document.querySelectorAll(".venue-copy li").forEach((item, index) => {
      item.textContent = content.venue.transit[index] || item.textContent;
    });
    setHtml(".sponsor-grid-print", printSupportHtml(content.supportOrganizations));
    setText(".end-mark p", content.event.closingLine);
  };

  const render = () => {
    if (document.querySelector(".hero")) {
      renderIndex();
      return;
    }
    if (document.querySelector(".cover-title")) {
      renderPrint();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
}());
