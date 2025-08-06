import { splitVal, daysDiff } from './functions.js';

export function time_between_dates(newer_date, older_date) {
    try {
        // Die Daten müssen im Format "DD.MM.YYYY" sein
        const newerDay = splitVal(newer_date, '.', 0);
        const newerMonth = splitVal(newer_date, '.', 1);
        const newerYear = splitVal(newer_date, '.', 2);
        const newerDateObject = new Date(`${newerYear}-${newerMonth}-${newerDay}`);

        const olderDay = splitVal(older_date, '.', 0);
        const olderMonth = splitVal(older_date, '.', 1);
        const olderYear = splitVal(older_date, '.', 2);
        const olderDateObject = new Date(`${olderYear}-${olderMonth}-${olderDay}`);

        // Berechnung der Differenz in Tagen
        const time_difference_in_days = daysDiff(newerDateObject, olderDateObject);

        // Ergebnis ausgeben oder weiterverarbeiten
        return time_difference_in_days;

    } catch (error) {
        console.log('time_between_dates', error);
    }
}