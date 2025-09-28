declare module 'react-select-country-list' {
  interface Country {
    label: string;
    value: string;
  }
  interface CountryList {
    getData: () => Country[];
  }
  export default function countryList(): CountryList;
}