var student_grouping = student_grouping || {};

student_grouping.popovers = function(){
	var me = this;
	this.pubSub = PubSub;
	

	
	/**************************
     * METHODS
     **************************/
    this.init = function(){
    	
    	this.subscribe('show-groupInfoPopover', this.showGroupPopover);
    }
    
    /**
     * Popup the group info popover next to the given group 
     */
    this.showGroupInfoPopover = function(group){
    	var groupPositionSize = group.getPositionAndSize();
    		
    }    
}
