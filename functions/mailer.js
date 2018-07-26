const sgMail        = require('@sendgrid/mail');
const mailconfigs   = require('../config/mail')
// ****      Module for mail management      ****

module.exports.sendSGEmail = function(to, subject, text, res) {

    sgMail.setApiKey(mailconfigs["sendgrid-api-key"]);
    const msg = {
    to: to,
    from: 'modimoteam@gmail.com',
    subject: subject,
    text: text,
    };
    sgMail.send(msg);
    return res.json({success: true, message: 'Mail sent'});
}
module.exports.sendSGTemplate = function(to, subject, sender, templateId) {

    sgMail.setApiKey(mailconfigs["sendgrid-api-key"]);
    sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
    const msg = {
    to: to,
    from: sender,
    subject: subject,
    templateId: templateId,
    };
    sgMail.send(msg);
    return true;
}


module.exports.sendSyncTemplatedSGEmail = function(to, subject, sub, templateId) {

    sub = sub || {};
    if (templateId == null) {
        return {'success': false, 'message': 'need template id'};
    }
    sgMail.setApiKey(mailconfigs["sendgrid-api-key"]);
    sgMail.setSubstitutionWrappers('{{', '}}'); // Configure the substitution tag wrappers globally
    const msg = {
        'from': {'email': 'modimoteam@gmail.com', 'name': 'Modimo'},
        'subject': subject,
        'templateId': templateId,
        to: to,
        substitutions: sub,
    };
    sgMail.send(msg);
    return true;

}

module.exports.sendSyncSGEmail = function(to, subject, text) {

    sgMail.setApiKey(mailconfigs["sendgrid-api-key"]);
    const msg = {
    to: to,
    from: 'modimoteam@gmail.com',
    subject: subject,
    text: text,
    };
    sgMail.send(msg);
    return true;

}