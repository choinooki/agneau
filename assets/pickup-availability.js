if (!customElements.get("pickup-availability")) {
	customElements.define(
		"pickup-availability",
		class PickupAvailability extends HTMLElement {
			constructor() {
				super();

				if (!this.hasAttribute("available")) return;

				this.errorHtml =
					this.querySelector("template").content.firstElementChild.cloneNode(
						true
					);
				this.onClickRefreshList = this.onClickRefreshList.bind(this);
				this.fetchAvailability(this.dataset.variantId);
			}

			fetchAvailability(variantId) {
				const variantSectionUrl = `${this.dataset.baseUrl}variants/${variantId}/?section_id=pickup-availability`;

				fetch(variantSectionUrl)
					.then((response) => response.text())
					.then((text) => {
						const sectionInnerHTML = new DOMParser()
							.parseFromString(text, "text/html")
							.querySelector(".shopify-section");
						this.renderPreview(sectionInnerHTML);
					})
					.catch((e) => {
						this.querySelector("button")?.removeEventListener(
							"click",
							this.onClickRefreshList
						);
						this.renderError();
					});
			}

			onClickRefreshList(evt) {
				this.fetchAvailability(this.dataset.variantId);
			}

			renderError() {
				this.innerHTML = "";
				this.appendChild(this.errorHtml);

				this.querySelector("button").addEventListener(
					"click",
					this.onClickRefreshList
				);
			}

			renderPreview(sectionInnerHTML) {
				const drawer = document.querySelector("pickup-availability-drawer");
				if (drawer) drawer.remove();
				if (!sectionInnerHTML.querySelector("pickup-availability-preview")) {
					this.innerHTML = "";
					this.removeAttribute("available");
					return;
				}

				this.innerHTML = sectionInnerHTML.querySelector(
					"pickup-availability-preview"
				).outerHTML;
				this.setAttribute("available", "");

				document.body.appendChild(
					sectionInnerHTML.querySelector("pickup-availability-drawer")
				);

				this.querySelector("button").addEventListener("click", (evt) => {
					document.querySelector("pickup-availability-drawer").show(evt.target);
				});
			}
		}
	);
}

if (!customElements.get("pickup-availability-drawer")) {
	customElements.define(
		"pickup-availability-drawer",
		class PickupAvailabilityDrawer extends HTMLElement {
			constructor() {
				super();

				this.onBodyClick = this.handleBodyClick.bind(this);

				this.querySelector("button").addEventListener("click", () => {
					this.hide();
				});

				this.addEventListener("keyup", (event) => {
					if (event.code.toUpperCase() === "ESCAPE") this.hide();
				});
			}

			handleBodyClick(evt) {
				const target = evt.target;
				if (
					target != this &&
					!target.closest("pickup-availability-drawer") &&
					!evt
						.composedPath()
						.includes(document.getElementById("ShowPickupAvailabilityDrawer"))
				) {
					this.hide();
				}
			}

			hide() {
				this.removeAttribute("open");
				document.body.removeEventListener("click", this.onBodyClick);
				document.body.classList.remove("overflow-hidden");
				document.body.classList.remove("pickup-availability-show");
				document.querySelector(
					".pickup-availability-overlay"
				).style.visibility = "hidden";
				removeTrapFocus(this.focusElement);
			}

			show(focusElement) {
				this.focusElement = focusElement;
				this.setAttribute("open", "");
				document.body.addEventListener("click", this.onBodyClick);
				document.body.classList.add("overflow-hidden");
				document.body.classList.add("pickup-availability-show");
				document.querySelector(
					".pickup-availability-overlay"
				).style.visibility = "visible";
				trapFocus(this);
			}
		}
	);
}
