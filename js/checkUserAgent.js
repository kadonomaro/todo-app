    /* check user agent for detect iOS devices */
    function checkUserAgent() {
        var iOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);
        var event = 'click';

        if (iOS !== null) {
            event = 'click';
        }

        return event;
}
    
export default checkUserAgent;