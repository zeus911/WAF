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

WAF.Widget.provide(

    /**
 * Accordion widget
 *
 * @class Accordion
 * @extends WAF.Widget
 */
    'Accordion',
    
    {
    },

    function WAFWidget(config, data, shared) {
        
    },
    {
        ready : function () {
            var i,
            icon,
            length,
            widget,
            header,
            section;
            
            //the only place to declare globale variable
            this.disabled   = false;    
            this._sections  = []; // array of accordion's section in dom order
            
            // initial
            icon = this.$domNode.find('.waf-state-collapsed .waf-accordion-icon').css('background-image');
            this._collapsedIcon = icon.substring(4,icon.length-1);
            this._collapsedIcon = this._collapsedIcon.replace(window.location.origin, '');
            //work around for firefox
            if (this._collapsedIcon.indexOf("\"") !== -1) {
                this._collapsedIcon = this._collapsedIcon.substr(1, this._collapsedIcon.length-2);
            }
            this.$domNode.find('.waf-state-collapsed .waf-accordion-icon').css('background-image', 'none');
            
            
            icon = this.$domNode.find('.waf-state-expanded .waf-accordion-icon').css('background-image') || '';
            this._expandedIcon = icon.substring(4,icon.length-1);
            this._expandedIcon = this._expandedIcon.replace(window.location.origin, '');
            //work around for firefox
            if (this._expandedIcon.indexOf("\"") !== -1) {
                this._expandedIcon = this._expandedIcon.substr(1, this._expandedIcon.length-2);
            }
            this.$domNode.find('.waf-state-expanded .waf-accordion-icon').css('background-image', 'none');
            
            
            this.$domNode.find('.waf-state-expanded .waf-accordion-icon img').attr('src', this._expandedIcon);
            this.$domNode.find('.waf-state-collapsed .waf-accordion-icon img').attr('src', this._collapsedIcon);
            
            this.enable();
            this._initSectionsArray();
            
            length  = this._sections.length;
            widget  = this;
            
            for ( i=0; i<length; i++ ) {
                
                section = this._sections[i];
                header  = this._getHeader(section);

                header.addListener('click', (function (widget, i) {
                    return function() {
                        if(widget.disabled){
                            return;
                        }
                        widget.toggleSection(i+1);
                    }
                })(widget, i));                
            } 
        },
        
        
        // private methods
        // return: header container
        _getHeader : function (section) {
            
            var
            children = section.getChildren();
            
            if(children[0].$domNode.attr('class').indexOf('accordion-header') != -1 ){
                return children[0];
            } else {
                return children[1];
            }
        },
        
        
        // return: content container
        _getContent : function (section) {
            
            var
            children = section.getChildren();
            
            if(children[1].$domNode.attr('class').indexOf('accordion-content') != -1 ){
                return children[1];
            } else {
                return children[0];
            }            
        },
        
        
        // get.links() returns unmodified and unsorted sections, we create a new global array 
        // and we sort sections accordiong to the top position.
        _initSectionsArray : function _initSectionsArray() {
            var
            i,
            links,
            length;
            
            links           = this.getLinks();
            length          = links.length;
            
            for ( i=0; i<length; i++) {
                this._sections.push(links[i]);
            }
            this._sections.sort(function(a,b){
                return (a.getPosition().top - b.getPosition().top);
            });
        },
        
        
        _getSection : function _getSection(index) {
            return this._sections[index];
        },
        
        
        _isCollapsed : function _isCollapsed(index) {
            var 
            section,
            headerHeight;
            
            section         = this._getSection(index);
            headerHeight    = this.config['data-header-height'];
            
            return (headerHeight == section.getHeight());
        },
        
        _getExpandedSectionIndex : function _getExpandedSectionIndex() {
            var
            i,
            length,
            headerHeight;
            
            length          = this._sections.length;
            headerHeight    = this.config['data-header-height'];
            
            for(i=0; i<length; i++) {
                if(this._sections[i].getHeight() > headerHeight){
                    return i;
                }
            }
        },
        
        
        /**
         * complete the current running animation immediately
         */
        _stopAnimation : function _stopAnimation(){
            
            var
            j,
            links,
            length;
            
            links   = this.getLinks();
            length  = links.length;
            
            for (j=0; j<length ; j++) {
                links[j].$domNode.stop(true,true);
            }
        },
        
        _slide : function _slide(index) {
            
            var
            i,
            top,
            sup,
            duration,
            iconExpand,
            iconCollapse,
            headerHeight,
            contentHeight,
            sectionToExpand,
            sectionToCollapse;
            
            
            duration        = parseInt(this.config['data-duration'],10);
            headerHeight    = parseInt(this.config['data-header-height'],10);
            contentHeight   = parseInt(this.config['data-content-height'],10);
            
            sectionToExpand     = this._getSection(index);
            sectionToCollapse   = this._getExpandedSectionIndex();
            
            iconExpand      = this._getHeader(sectionToExpand).getChildren()[1];
            iconCollapse    = this._getHeader(this._sections[sectionToCollapse]).getChildren()[1];
                
            
            if( index < sectionToCollapse) {
                i   = index + 1;
                top = '+=' + contentHeight;
                sup = sectionToCollapse - 1;
                
                
                sectionToExpand.$domNode.animate({
                    height  : headerHeight + contentHeight
                }
                , duration);  
                
                this._sections[sectionToCollapse].$domNode.animate({
                    height  : headerHeight,
                    top     : top
                }
                , duration);  
                
                
                    
            } else {
                i   = sectionToCollapse+1;
                top = '-=' + contentHeight;
                sup = index - 1;
                

                sectionToExpand.$domNode.animate({
                    height  : headerHeight + contentHeight,
                    top     : top
                }
                , duration);  
                
                this._sections[sectionToCollapse].$domNode.animate({
                    height  : headerHeight
                }
                , duration); 
            }
            
            this._sections[sectionToCollapse].removeClass('waf-state-expanded');
            this._sections[sectionToCollapse].addClass('waf-state-collapsed');
            this._sections[sectionToCollapse].$domNode.find('.waf-state-expanded').addClass('waf-state-collapsed');
            this._sections[sectionToCollapse].$domNode.find('.waf-state-collapsed').removeClass('waf-state-expanded');
            

            sectionToExpand.addClass('waf-state-expanded');
            sectionToExpand.removeClass('waf-state-collapsed');
            sectionToExpand.$domNode.find('.waf-state-collapsed').addClass('waf-state-expanded');
            sectionToExpand.$domNode.find('.waf-state-expanded').removeClass('waf-state-collapsed');
            
            this.$domNode.find('.waf-state-expanded .waf-accordion-icon img').attr('src',this._expandedIcon);
                this.$domNode.find('.waf-state-collapsed .waf-accordion-icon img').attr('src',this._collapsedIcon);
                
            for (; i<=sup; i++) {
                this._sections[i].$domNode.animate({
                    top : top
                }, duration);
            }            
        },
        
        
        _slideCollapsibleAccordion : function _slideCollapsibleAccordion(index){
            var
            i,
            top,
            icon,
            height,
            length,
            section,
            duration,
            headerHeight,
            contentHeight;
            
            contentHeight   = parseInt(this.config['data-content-height'],10); 
            headerHeight    = parseInt(this.config['data-header-height'],10);
            duration        = parseInt(this.config['data-duration'],10);
            section         = this._getSection(index);
            length          = this._sections.length;
            icon            = this._getHeader(section).getChildren()[1];
            
            if(this._isCollapsed(index)) {
                
                top     = '+='+contentHeight;
                height  = headerHeight + contentHeight;
                
                icon.$domNode.children().attr('src',this.config['data-expanded-icon']);
                section.$domNode.addClass('waf-state-expanded');
                section.$domNode.removeClass('waf-state-collapsed');
                section.$domNode.find('.waf-state-collapsed').addClass('waf-state-expanded');
                section.$domNode.find('.waf-state-expanded').removeClass('waf-state-collapsed');
            
            } else {
                
                top     = '-=' + contentHeight;
                height  = headerHeight;
                
                icon.$domNode.children().attr('src',this.config['data-collapsed-icon']);
                section.$domNode.removeClass('waf-state-expanded');
                section.$domNode.addClass('waf-state-collapsed');
                section.$domNode.find('.waf-state-expanded').addClass('waf-state-collapsed');
                section.$domNode.find('.waf-state-collapsed').removeClass('waf-state-expanded');
            }
            
            section.$domNode.animate({
                height: height
            }
            , duration); 
                
            for(i=index+1; i<length; i++){
                this._sections[i].$domNode.animate({
                    top: top
                }, duration);
            }
        },
        
        
        // public methods
        destroy : function destroy() {
            $('#'+this.divID).remove();
        },
        
        
        disable : function disable() {
            this.disabled = true;
        },
        
        
        enable: function enable() {
            this.disabled = false;
        },
        
        
        isDisabled : function isDisabled(){
            return this.disabled ;
        },
        
        
        toggleSection : function toggleSection(index){
            var
            expandSeveral;
            
            index = index -1;
            
            if(index >= this._sections.length || index <0)
            {
                return false;
            }
            
            this._stopAnimation();
            
            expandSeveral = (this.config['data-expand-several'] === 'false');
            
            if(expandSeveral){
                this._slideCollapsibleAccordion(index);
            } else if (!expandSeveral && this._isCollapsed(index)) {
                this._slide(index);
            }
            return true;
            
        },
        
        expand : function expand(index){
            var
            expandSeveral;
            
            index = index -1;
            
            if(index >= this._sections.length || index <0)
            {
                return false;
            }
            
            if(!this._isCollapsed(index)){
                return false;
            }
            
            expandSeveral = (this.config['data-expand-several'] === 'false');
            
            this._stopAnimation();
            
            if(expandSeveral){
                this._slideCollapsibleAccordion(index);
            } else {
                this._slide(index);
            }
            return true;
        },
        
        expandAll : function expandAll(){
            var expandSeveral = (this.config['data-expand-several'] === 'false');
            
            var length = this.getNumberOfSections();
            
            if(!expandSeveral){
                return false;
            }
            
            for(var i=1; i<=length; i++){
                this.expand(i);
            }
            return true;           
            
        },
        
        collapseAll : function collapseAll(){
            var expandSeveral = (this.config['data-expand-several'] === 'false');
            
            var length = this.getNumberOfSections();
            
            if(!expandSeveral){
                return false;
            }
            
            for(var i=1; i<=length; i++){
                this.collapse(i);
            }
            return true;           
            
        },
        
        
        collapse : function collapse(index){
            var
            expandSeveral;
            
            index = index -1;
            
            if(index >= this._sections.length || index <0)
            {
                return false;
            }
            
            if(this._isCollapsed(index)){
                return false;
            }
            
            expandSeveral = (this.config['data-expand-several'] === 'false');
            
            this._stopAnimation();
            
            if(expandSeveral){
                this._slideCollapsibleAccordion(index);
                return true;
            } else {
                return false;
            } 
        },
        
        getNumberOfSections : function getNumberOfSections(){
            return this._sections.length;            
        },
        
        isCollapsed : function isCollapsed(index){
            if(index > this.getNumberOfSections() || index <0 ) {
                return null;
            }
            
            return this._isCollapsed(index-1);
        } 
        
    });