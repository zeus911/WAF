/*
* This file is part of Wakanda software, licensed by 4D under
*  (i) the GNU General Public License version 3 (GNU GPL v3), or
*  (ii) the Affero General Public License version 3 (AGPL v3) or
*  (iii) a commercial license.
* This file remains the exclusive property of 4D and/or its licensors
* and is protected by national and international legislations.
* In any event, Licensee's compliance with the terms and conditions
* of the applicable license constitutes a prerequisite to any use of this file.
* Except as otherwise expressly stated in the applicable license,
* such license does not include any other license or rights on this file,
* 4D's and/or its licensors' trademarks and/or other proprietary rights.
* Consequently, no title, copyright or other proprietary rights
* other than those specified in the applicable license is granted.
*/
/**
* @author       The Wakanda Team
* @date		august 2010
* @version	0.1
*
*/
WAF.Widget.provide(
    'GoogleMap',   
    {},

    /**
     * The constructor of the widget
     *
     * @shared
     * @property constructor
     * @type Function
     **/
    function WAFWidget(config, data, shared) {
        var
        widget  = this,
        $widget = this.$domNode;
        
        config                  = config                  || {};
        config['id']            = config['id']            || {};
        config['data-mapType']  = config['data-mapType']  || '0';    
        config['data-position'] = config['data-position'] || '0'; 

        if (this.source) {
            this.source.addListener(
                'onAttributeChange', 
                function(event) {
                    
                    
                    if (widget != null) {                              
                        // base url of static google map
                        var map = 'http://maps.google.com/maps/api/staticmap?sensor=false';

                        // fix the position on wich is centered the map
                        map += '&center=' + event.dataSource.getAttribute(widget.att.name).getValue();

                        // fix a zoom value
                        map += '&zoom=' + $widget.data('zoom');

                        // Map type :
                        map += '&maptype=' + $widget.data('maptype');

                        // fix the size of the image
                        map += '&size=' + parseInt($widget.width()) + 'x' + parseInt($widget.width());

                        // add a marker on the map
                        map += '&markers=color:' + $widget.data('marker-color') + '|size:' + $widget.data('marker-size') + '|label:' + $widget.data('marker-label') + '|' + event.dataSource.getAttribute(widget.att.name).getValue();
                        event.data.domNode.src = map;
                    }
                },
                {
                    attributeName: this.att.name,
                    id: config.id
                },
                {
                    widget : this, 
                    domNode: document.getElementById(config.id)
                });      
        } else {
            var map = 'http://maps.google.com/maps/api/staticmap?sensor=false';

            // fix the position on wich is centered the map
            map += '&center=' + config['data-position'];

            // fix a zoom value
            map += '&zoom=' + config['data-zoom'];

            // Map type :
            map += '&maptype=' + $widget.data('maptype');

            // fix the size of the image
            map += '&size=' + $widget.css('width').replace('px','') + 'x' + $widget.css('height').replace('px','');

            // add a marker on the map
            map += '&markers=color:' + $widget.data('marker-color') + '|size:' + $widget.data('marker-size') + '|label:' + $widget.data('marker-label') + '|' + config['data-position'];
            document.getElementById(config.id).src = map;
        }
    },{
        
    }
    );










