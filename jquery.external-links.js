/**
 * External Links
 *
 * Plugin to open external links in new window/tab and track click (google analytics)
 * We use target=_blank instead of window.open because browsers handle it better and more consistently.
 *
 * @version 1.2.1
 * @author Maxime Thirouin <maxime.thirouin@gmail.com>
 */
(function ($)
{
    $.fn.externalLinks = function(options)
    {
        options = $.extend({
            filterHostname: true,
            className: 'external',
            rel: 'external',
            trackGA: 'External Links',
            log: false
        }, options);

        var $this = $(this);

        // auto filter external links
        if (options.filterHostname)
        {
            // Method using not([href*=HOSTNAME]) is not good : ex: http://somesite.fr/vote/HOSTNAME
            $this = $this.filter(function()
            {
                // On a <a href> the javascript property hostname exists
                return this.hostname && this.hostname !== window.location.hostname;
            })
            .filter(function()
            {
                // links already "externalized" don't need a second pass
                // maybe it's a heavy performance cost an can be set optionals
                return !$(this).data('_externalLinks');
            });
        }
        if (options.className)
        {
            $this.addClass(options.className);
        }

        if (options.rel)
        {
            $this.attr('rel', options.rel);
        }

        // flag "externalized" links
        $this.data('_externalLinks', true);

        // can use bind if not ajax (does this comment have sense ?)
        // keyup is used for
        $this.bind('click keyup', function()
        {
            // we use target blank instead of window.open because most browsers have a better behavior with the target
            // http://alexking.org/blog/2005/12/30/new-windows
            // btw we initialise the behavior just on user action, probably less expensive
            this.target = "_blank"; //open in new window

            // if analytics, track link click, if href present (<a>)
            if (options.trackGA && this.href && _gaq)
            {
                // External links are recorded as 'External Links' under Google Analytics event tracking
                // There are not recorded as 'Outbound Links' because of it's not (new window!)
                // http://code.google.com/apis/analytics/docs/gaJS/gaJSApi_gaq.html
                var track = _gaq.push(['_trackEvent', options.trackGA, this.hostname, this.href]);
            }

            if (options.log && console.log)
            {
                console.log('External link open: ', this.href);

                if (typeof track != 'undefined')
                {
                    console.log('Tracking: ', track);
                }
            }
        });

        return this;
    };

})(jQuery);
