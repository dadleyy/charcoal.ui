import Ember from 'ember';

const { Logger, Service, inject } = Ember;
const ij = inject.service();

const FIELD_RE = /^field:(.*)/i;
const REASON_RE = /^reason:(.*)/i;
const MISSING_RE = /^missing\stranslation/i;

function parse(error_list = [ ]) {
  const i18n = this.get('i18n');
  const result = [ ];
  const unknown_error = i18n.t('unknown_error');

  for(let i = 0, c = error_list.length; i < c; i++) {
    let { title, status } = error_list[i] || { };

    if(FIELD_RE.test(title) === true) {
      let field = FIELD_RE.exec(title)[1];
      result.push(i18n.t("invalid_field_x", { field }));
      continue;
    }

    if(REASON_RE.test(title) !== true) {
      result.push(unknown_error);
      continueu;
    }

    let reason = REASON_RE.exec(title)[1];
    let message = i18n.t(`api_errors.${reason}`);

    if(MISSING_RE.test(message) === true) {
      Logger.warn(`missing translation: api_errors.${reason}`);
    }

    result.push(MISSING_RE.test(message) ? unknown_error : message);
  }

  return result;
}

export default Service.extend({ parse, i18n: ij });
