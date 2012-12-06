var student_grouping = student_grouping || {};

student_grouping.filters = function(){
	var me = this;
	this.pubSub = PubSub;
	
	this.filterAttributeElem = '#filter-attribute';
	this.filterOperatorElem = '#filter-operator';
	this.filterValueTxtElem = '#filter-value';
	this.filterValueSelElem = '#filter-values';
	this.filterAddBtnElem = '#filter-add-btn';
	
	this.filterDefaultOperatorClass = '.filter-operator-default-option';
	
	this.availableFilters = [];
	
	this.selectedFiltersElem = '#selected-filters';	
	this.selectedFilters = [];
	this.selectedFilterCloseBtn = ".select2-search-choice-close";
	
	/**************************
     * HTML Templates
     **************************/
	this.selectedFilterTemplate = "<li class='select2-search-choice' data-selectedFilter=''>" +
									'<a href="#" onclick="return false;" class="select2-search-choice-close" style="display:inline" tabindex="-1"></a>' +
									"<div class='filter-text' style='display:inline'></div>"
								  "</li>";
	
	/**************************
     * METHODS
     **************************/
    
    this.init = function(){    
    	    	
		// set up the filters
		_.each(fakeFilters, function(filter){		
			me.addFilter(filter);
		});    	
    	
    	$(this.filterAttributeElem).select2( {width: 'element'} );
    	$(this.filterOperatorElem).select2( {width:'element'} );
    	$(this.filterOperatorElem).select2('disable');
    	
    	$(this.filterAttributeElem).change(function(event){
    		me.attributeSelected(event);
    	});
    	
    	$(this.filterOperatorElem).change(function(event){
    		me.attributeOperatorSelected(event);
    	});
    	
    	$(this.filterAddBtnElem).click(function(event){
			me.addSelectedFilter();
		});
		
		// subscribe to pubsub events 
		this.pubSub.subscribe('add-manual-filter', function(filter){
			
			// reset filter, if already applied
			me.removeFilterByAttribute(filter.attributeId);
			
			// add to list
			me.selectedFilters.push(filter);
			me.pubSub.publish('filter-student-list');
		});
    }
    
    /**
     * Add the given filter to the list of selectable filters 
     */
    this.addFilter = function(filter){
    	this.availableFilters.push(filter);
    	
    	$(this.filterAttributeElem)
    		.append(this.createOption(filter.attributeId, filter.attributeName));    		
    }
    
    /**
     * Populate the operators and available values  
     */
    this.attributeSelected = function(event) {
    	var attribute = $(this.filterAttributeElem).val();
    	var filter = _.find(this.availableFilters, function(f){
    		return f.attributeId === attribute;
    	});
    	
    	// re-populate the operators dropdown
    	$(this.filterOperatorElem).select2('destroy');
    	$(this.filterOperatorElem).find(':not(' + this.filterDefaultOperatorClass +')').remove();
    	_.each(filter.operators, function(op){    		
    		$(me.filterOperatorElem).append(me.createOption(op, op));
    	});
    	$(this.filterOperatorElem).select2( {width: 'element'} );
    	
    	
    }
    
    /**
     *  
     */
    this.attributeOperatorSelected = function(event) {
    	var attribute = $(this.filterAttributeElem).val();
    	var filter = _.find(this.availableFilters, function(f){
    		return f.attributeId === attribute;
    	});
    	
    	var operator = $(this.filterOperatorElem).val();
    	
    	// if operator is contains then attach multiple to the values dropdown
    	if (operator === 'contains') {
    		$(this.filterValueSelElem).attr('multiple', 'multiple');
    	} else {
    		$(this.filterValueSelElem).removeAttr('multiple');
    	}
    	    	
    	$(this.filterValueSelElem).select2('destroy');
    	if (filter.values.length === 0){
    		$(this.filterValueTxtElem).show();
    		$(this.filterValueSelElem).hide();
    	} else {
    		$(this.filterValueSelElem).empty();
    		// add the available values to the dropdown
    		_.each(filter.values, function(val){
    			
    			var option = null;
    			if ($.isPlainObject(val)){
    				option = me.createOption(val.id, val.title);	
    			} else {
    				option = me.createOption(val, val);
    			}
    			
    			$(me.filterValueSelElem).append(option);
    		});
    		$(this.filterValueSelElem).select2( {
    			width: 'element', 
    			closeOnSelect: false
    		} );
    		
    		$(this.filterValueTxtElem).hide();
    	}
    }
    
    /**
     * Add the selected filter to the list of filters 
     */
    this.addSelectedFilter = function(){
    	
    	// get value from either textbox or dropdown
    	var value = $(this.filterValueTxtElem).val();
    	var dropdownVal = $(this.filterValueSelElem).val() !== null ? $(this.filterValueSelElem).val() : [];
	    	    	    	    
	    if (value === ''){
	    	// check whether we are checking for a single value or multiple values
	    	if ($(this.filterValuesSelElem).attr('multiple') === 'multiple'){    		 			    	    		    	
	    		_.each(dropdownVal, function(val){
	    			value += (val + ";");
	    		});		    	  
	    	} else {
	    		value = dropdownVal;	
	    	}
    	}
    	
    	// get the selected filters     	
    	var filter = {
    		attributeName : $(this.filterAttributeElem).val(),
    		attributeId : $(this.filterAttributeElem).val(),
    		operator : $(this.filterOperatorElem).val(),
    		value : value,
    		values : dropdownVal
    	}
    	    	
    	// remove filter from list if previously added    	
    	this.removeFilterByAttribute(filter.attributeId);
    	$("li[data-selectedFilter='" + filter.attributeId + "']").remove();    	
    	
    	// add to list of selected filters
    	this.selectedFilters.push(filter);
    	
    	// render the selected filter on screen
    	var selectedFilterHtml = $(this.selectedFilterTemplate);
    	$(selectedFilterHtml).find('.filter-text').html(filter.attributeName + ' ' 
    		+ filter.operator + ' ' + '"' + filter.value + '"');
    	$(selectedFilterHtml).attr('data-selectedFilter', filter.attributeId);
    		
    	$(this.selectedFiltersElem).append(selectedFilterHtml);
    	
    	// reset selected values
    	this.resetFilters();
    	
    	// bind event handler for removing this filter
    	$(selectedFilterHtml).find(this.selectedFilterCloseBtn).click(function(event){
    		$(selectedFilterHtml).remove();
    		me.selectedFilters = _.filter(me.selectedFilters, function(f){
	    		return f.attributeId !== filter.attributeId;
	    	});
	    	
	    	// notify others to filter after removing
	    	me.pubSub.publish('filter-student-list');
    	});
    	
    	// notify others to filter
    	me.pubSub.publish('filter-student-list');
    },
    
    /**
     * Remove the filter with the selected attribute from the list 
     */
    this.removeFilterByAttribute = function(attribute){    	
    	this.selectedFilters = _.filter(this.selectedFilters, function(filter){
    		return filter.attributeId !== attribute;
    	});
    }
    
    /**
     * Apply the selected filters on the given list 
     */
    this.applyFilters = function(listOfStudents){
    	
    	var filteredList = listOfStudents;
    	
    	_.each(this.selectedFilters, function(filter){
    		var attribute = filter.attributeId;
    		var operator = filter.operator;
    		var value = '';
    		
    		if (filter.values.length === 0)
    		{
    			value = filter.value;
    		} else {
    			value = filter.values;
    		}
    		    		   
    		// filter with selected operator and value		
    		filteredList = _.filter(filteredList, function(student){    
    			var studentAttributeVal = student.studentData[attribute];			
    			switch(operator) {
    				case '=' : return studentAttributeVal == parseFloat(value);
    				case '<' : return studentAttributeVal < parseFloat(value);
    				case '>' : return studentAttributeVal > parseFloat(value);
    				case '<=' : return studentAttributeVal <= parseFloat(value);
    				case '>=' : return studentAttributeVal <= parseFloat(value);
    				case 'contains' :     					
    					var intersection = _.any(studentAttributeVal, function(studentVal){
    						var studentHasDisability = _.find(value, function(val){
    							return val === studentVal;
    						});
    						return studentHasDisability !== undefined;
    					});
    					
    					return intersection;
    				case 'equals' :
    					var matchingVal = _.find(studentAttributeVal, function(studentVal){
    						return studentVal === value;
    					});
    					return matchingVal !== undefined;
    				case 'startsWith' : 
    					return studentAttributeVal.lastIndexOf(value, 0) === 0;
    			}
    		});
    	});
    	
    	return filteredList;
    }
    
    /**
     * Creates an HMTL option element 
     */
    this.createOption = function(val, text){    	    	
    	return "<option value='" + val + "'>" +
    			text + "</option>";
    }
    
    /**
     *  
     */
    this.resetFilters = function(){
    	    	
    	$(this.filterAttributeElem).select2('val', '');
    	
    	$(this.filterOperatorElem).prepend(this.createOption('',''));    	
    	$(this.filterOperatorElem).select2('val','');
    	$(this.filterOperatorElem).select2('disable');    	
    	
    	$(this.filterValueSelElem).select2('destroy');
    	$(this.filterValueSelElem).empty().hide();
    	
    	$(this.filterValueTxtElem).val('').show();
    }
}
