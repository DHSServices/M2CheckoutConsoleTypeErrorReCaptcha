define([
    'uiComponent',
    'jquery',
    'ko',
    'underscore',
    'Magento_ReCaptchaFrontendUi/js/registry',
    'Magento_ReCaptchaFrontendUi/js/reCaptchaScriptLoader',
    'Magento_ReCaptchaFrontendUi/js/nonInlineReCaptchaRenderer'
], function(Component, $, ko, _, registry, reCaptchaLoader, nonInlineReCaptchaRenderer) {
    'use strict';

    return function(Component) {
        return Component.extend({
            initCaptcha: function () {
                //here is check for RECAPTCHA settings
                if (typeof this.settings === 'undefined')
                {
                    return;
                }

                var $parentForm,
                    $wrapper,
                    $reCaptcha,
                    widgetId,
                    parameters;

                if (this.captchaInitialized)
                {
                    return;
                }

                this.captchaInitialized = true;

                $wrapper = $('#' + this.getReCaptchaId() + '-wrapper');
                $reCaptcha = $wrapper.find('.g-recaptcha');
                $reCaptcha.attr('id', this.getReCaptchaId());

                $parentForm = $wrapper.parents('form');

                parameters = _.extend(
                    {
                        'callback': function (token) { // jscs:ignore jsDoc
                            this.reCaptchaCallback(token);
                            this.validateReCaptcha(true);
                        }.bind(this),
                        'expired-callback': function () {
                            this.validateReCaptcha(false);
                        }.bind(this)
                    },
                    this.settings.rendering
                );

                if (parameters.size === 'invisible' && parameters.badge !== 'inline')
                {
                    nonInlineReCaptchaRenderer.add($reCaptcha, parameters);
                }


                widgetId = grecaptcha.render(this.getReCaptchaId(), parameters);
                this.initParentForm($parentForm, widgetId);

                registry.ids.push(this.getReCaptchaId());
                registry.captchaList.push(widgetId);
                registry.tokenFields.push(this.tokenField);
            },

            getIsInvisibleRecaptcha: function ()
            {
                // checking getIsInvisibleRecaptcha  settings
                if (typeof this.settings === 'undefined')
                {
                    return;
                }
                return this.settings.invisible;
            }
        });
    }
});
