import Ember from 'ember';
import ENV from 'charcoal/config/environment';

const { inject } = Ember;
const { LOCALE_HOME } = ENV;
const DEFAULT_LOCALE = 'en';
const TITLE_DELIMETER = ' | ';

function model({ locale: url_locale }) {
  const i18n = this.get('i18n');
  const locale = url_locale || DEFAULT_LOCALE;

  function success(response) {
    i18n.addTranslations(locale, response);
    i18n.set('locale', locale);
    return true;
  }

  return this.get('ajax').request(`${LOCALE_HOME}/${locale}`).then(success);
}

function title(tokens) {
  return [this.get('i18n').t('charcoal')].concat(tokens).join(TITLE_DELIMETER);
}

export default Ember.Route.extend({
  queryParams: { locale: 'en' },
  i18n: inject.service(), 
  model, title
});
