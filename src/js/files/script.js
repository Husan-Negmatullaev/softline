import Aos from "aos";
import { removeClasses } from "./functions.js";

import 'aos/dist/aos.css';

window.addEventListener("load", windowLoad);

window.addEventListener("click", documentActions)

function windowLoad() {
  // Init libs

  Aos.init({
    duration: 800,
  });

  digitsAnimation();
}

function digitsAnimation() {
  function digitsCountersInit(digitsCountersItems) {
    const digitsCounters = digitsCountersItems ? digitsCountersItems : document.querySelectorAll("[data-digits-counter]");
    if (digitsCounters) {
      digitsCounters.forEach(digitCounter => {
        digitsCountersAnimate(digitCounter);
      });
    }
  }

  function digitsCountersAnimate(digitsCounter) {
    let startTimestamp = null;
    const duration = parseInt(digitsCounter.dataset.digitsCounter) ? parseInt(digitsCounter.dataset.digitsCounter) : 1000;
    const startValue = parseInt(digitsCounter.innerHTML);
    const startPosition = 0;
    const step = (timestamp) => {
      if (!timestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      digitsCounter.innerHTML = Math.floor(progress * (startPosition + startValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }

  let options = {
    threshold: 0.3,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetElement = entry.target;
        const digitsCountersItems = targetElement.querySelectorAll("[data-digits-counter]");
        if (digitsCountersItems.length) {
          digitsCountersInit(digitsCountersItems);
        }
        observer.unobserve(targetElement);
      }
    })
  }, options);

  const sections = document.querySelectorAll("[class*='page__']");
  if (sections.length) {
    sections.forEach(section => {
      observer.observe(section);
    })
  }
}

// ========================================================================================================================================================

function documentActions(event) {
  const targetElement = event.target;

  handleDropdownClick(targetElement);

  handleMapClick(targetElement);
}

function handleDropdownClick(targetElement) {
  if (targetElement.closest("[data-dropdown-button]")) {
    const parentDropdown = targetElement.closest("[data-dropdown]");
    const contentDropdown = parentDropdown.querySelector("[data-dropdown-content]");

    parentDropdown.classList.toggle("_active-dropdown-parent");
    targetElement.classList.toggle("_active-dropdown");
    contentDropdown.classList.toggle("_active-dropdown");
  }

  if (window.innerWidth > 991) {
    if (!targetElement.closest("[data-dropdown-button]") && document.querySelectorAll("[data-dropdown-button]._active-dropdown").length) {
      removeClasses(document.querySelectorAll("[data-dropdown-button]._active-dropdown"), "_active-dropdown");
      removeClasses(document.querySelectorAll("[data-dropdown]._active-dropdown-parent"), "_active-dropdown-parent");
      removeClasses(document.querySelectorAll("[data-dropdown-content]._active-dropdown"), "_active-dropdown");
    }
  }
}

function handleMapClick(targetElement) {
  if (targetElement.closest("[data-map-title]")) {
    const map = targetElement.closest("[data-map]");
    const mapAreas = map.querySelector("[data-map-areas]");
    const mapRegions = map.querySelector("[data-map-regions]");

    const mapParent = targetElement.closest("[data-map]");
    const mapImage = mapParent.querySelector("[data-map-image] img");
    const [index, imageUrl] = targetElement.dataset.mapTitle.split(",");
    const activeMapTitles = mapParent.querySelectorAll("[data-map-title]._active");

    removeClasses(activeMapTitles, "_active");
    targetElement.classList.add("_active");

    mapImage.src = imageUrl;

    if (targetElement.closest("[data-map-regions]")) {
      const findAreaByRegionId = mapAreas.querySelector(`[data-map-title="${index},${imageUrl}"]`);

      if (mapAreas.querySelector("[data-map-title]._active")) {
        mapAreas.querySelector("[data-map-title]._active").classList.remove("_active");
      }

      findAreaByRegionId ? findAreaByRegionId.classList.toggle("_active") : null;
    }

    if (targetElement.closest("[data-map-areas]")) {
      const findRegionByAreaId = mapRegions.querySelector(`[data-map-title="${index},${imageUrl}"]`);

      if (mapRegions.querySelector("[data-map-title]._active")) {
        mapRegions.querySelector("[data-map-title]._active").classList.remove("_active");
      }

      findRegionByAreaId ? findRegionByAreaId.classList.toggle("_active") : null;
    }
  }
}