class SearchForm extends HTMLElement {
	constructor() {
		super();
		this.input = this.querySelector('input[type="search"]');

		if (this.input) {
			this.input.form.addEventListener("reset", this.onFormReset.bind(this));
			this.input.addEventListener(
				"input",
				debounce((event) => {
					this.onChange(event);
				}, 300).bind(this),
			);

			if(this.input.parentElement.querySelector(".search__input--icon-clear") != null) {
				let clearIcon = this.input.parentElement.querySelector(".search__input--icon-clear");
				
				clearIcon.addEventListener('click', () => {
					this.input.form.reset();
					this.onFormReset();
				});
			}
		}
	}

	shouldResetForm() {
		return !document.querySelector('[aria-selected="true"] a');
	}

	onFormReset(event) {
		// Prevent default so the form reset doesn't set the value gotten from the url on page load
		if (event) {
			event.preventDefault();
		}
		// Don't reset if the user has selected an element on the predictive search dropdown
		if (this.shouldResetForm()) {
			this.input.value = "";
			//this.input.focus();
		}
	}
}

customElements.define("search-form", SearchForm);
