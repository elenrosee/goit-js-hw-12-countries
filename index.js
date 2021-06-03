import debounce from 'lodash.debounce';
import countryTpl from './templates/country';
import countryListTpl from './templates/countries-list';
import fetchCountries from './js/fetchCountries';

import { alert, defaultModules, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

import '@pnotify/core/dist/PNotify.css';
import * as PNotifyMobile from '@pnotify/mobile';
import '@pnotify/mobile/dist/PNotifyMobile.css';

defaultModules.set(PNotifyMobile, {});

const refs = {
  countryContainer: document.querySelector('.country-container'),
  searchForm: document.querySelector('.field'),
};

refs.searchForm.addEventListener('input', debounce(onInputChange, 500));

function renderCountryCard(country) {
  clearCountryContainer();

  const markup = countryTpl(country[0]);
  refs.countryContainer.insertAdjacentHTML('afterbegin', markup);
}

function renderCountryList(country) {
  clearCountryContainer();

  const markup = country.map(c => countryListTpl(c)).join('');
  refs.countryContainer.insertAdjacentHTML('afterbegin', markup);
}

function onInputChange(e) {
  const inputValue = e.target.value;

  fetchCountries(inputValue)
    .then(country => {
      if (country.length <= 10 && country.length > 1) {
        renderCountryList(country);
      } else if (country.length === 1) {
        renderCountryCard(country);
      } else if (country.length > 10) {
        alert({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      }
    })
    .catch(() => {
      alert({
        text: 'Sorry, there is no country with such symbols. Try again.',
        hide: true,
        delay: 2000,
      });
    });
}

function clearCountryContainer() {
  if (refs.countryContainer.textContent) {
    refs.countryContainer.textContent = '';
  }
}
