import addressData from './country.json';

export const {
    REACT_APP_BASE_API
} = import.meta.env;

export const cookieName = "g-auth-code";


export const locationJson = addressData.map( country => ( {
    countryName: country.name,
    countryId: country.id,
    value: country.name,
    label: country.name,
    states: country?.states?.map( state => ( {
        countryName: country.name,
        countryId: country.id,
        stateName: state.name,
        stateId: state.id,
        value: state.name,
        label: state.name,
        cities: state.cities.map( city => ( {
            countryName: country.name,
            countryId: country.id,
            stateName: state.name,
            stateId: state.id,
            cityName: city.name,
            cityId: city.id,
            value: city.name,
            label: city.name
        } ) )
    } ) )
} ) );

export const currentTime = () => {
    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours < 10 ? '0' + hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export const numberWithCommas = ( x ) => {
    return x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
}

export const tradeTerms = [
    { value: 'CFR Chattogram, Bangladesh', label: 'CFR Chattogram, Bangladesh' },
    { value: 'CIF Chattogram, Bangladesh', label: 'CIF Chattogram, Bangladesh' },
    { value: 'CPT Dhaka, Bangladesh', label: 'CPT Dhaka, Bangladesh' },
    { value: 'FOB( Load Port )', label: 'FOB( Load Port )' },
    { value: 'EX - WORK', label: 'EX - WORK' }
]
export const payTerms = [
    { value: 'TT', label: 'TT' },
    { value: 'Wire Transfer', label: 'Wire Transfer' }
]

export const typeOptions = [
    { label: 'Import', value: 'Import' },
    { label: 'Inland Purchase', value: 'Inland_Purchase' },
    { label: 'D2D', value: 'D2D' },
]

export const shipmentModes = [
    { label: 'By Sea', value: 'By_Sea' },
    { label: 'By Air', value: 'By_Air' },
    { label: 'By Road', value: 'By_Road' }
]
