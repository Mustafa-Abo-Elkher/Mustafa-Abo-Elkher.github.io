document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".nav-list");
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.querySelector(".header");
  const sections = document.querySelectorAll("section");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const contactForm = document.querySelector(".contact-form");

  // Toggle hamburger menu
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navList.classList.toggle("active");
  });

  // Smooth scrolling and active link highlighting
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        window.scrollTo({ top: targetSection.offsetTop, behavior: "smooth" });
        history.pushState(null, "", `#${targetId}`);
      }

      hamburger.classList.remove("active");
      navList.classList.remove("active");
    });
  });

  // Add shadow to header on scroll
  window.addEventListener("scroll", () => {
    header.style.boxShadow =
      window.scrollY > 100 ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none";

    // Highlight active section in navigation
    let activeSection = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 100) {
        activeSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${activeSection}`) {
        link.classList.add("active");
      }
    });
  });

  // Portfolio filtering
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.getAttribute("data-filter");
      portfolioItems.forEach((item) => {
        item.style.display =
          filter === "all" || item.getAttribute("data-category") === filter
            ? "block"
            : "none";
      });
    });
  });

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const subject = formData.get("subject") || "No Subject";
      const message = formData.get("message");

      if (!name || !email || !message) {
        alert("Please fill in all required fields.");
        return;
      }

      const mailtoLink = `mailto:mustafasaidelkher@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;
      window.location.href = mailtoLink;
    });
  }
});

function toggleLightMode() {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
}

async function sendMessageFunc(e) {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);
  const data = Object.fromEntries(formData.entries());
  data.date = new Date();
  try {
    const response = await fetch(
      "https://portfolio-backened-one.vercel.app/api/email",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    console.log("Message was sent successfully!");
  } catch (error) {
    console.log(`${error.message}`);
  }
}
contactForm.addEventListener("submit", sendMessageFunc);
