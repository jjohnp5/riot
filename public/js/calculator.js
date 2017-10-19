jQuery(document).ready(function() {
	jQuery.ajax({
		method: 'GET',
		dataType: 'json',
		data: {
			type: 'json'
		},
		success: function(data, status, jqXHR) {
			main(jQuery, data);
		}
	});
	
});

/*
 *  Function main, called when document is loaded
 *  @param	$		function	jQuery is passed as param in order to avoid conflict with $ usage
 *  @param	data	object		Object that contains the item data
 */

function main($, data) {
	
	// Enable all tooltips
	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	});

	// Define the elements
	var poolItemsContainer = $("#all");
	var selectedItemsContainer = $("#selected");
	var poolItems = Object.keys(data);
	var selectedItems = [];
	var availableGold = 0;
	var availableGoldContainer = $("#goldval");

	// Handle click events

	$("#set-gold").click(function handleClick() {
		var gold = $("#gold").val();
		// console.log(gold);
		if(gold && /^\d+$/.test(gold)) {
			availableGold = parseInt(gold);
			availableGoldContainer.text(availableGold);

			setUp();
		}
	});

	// Utility functions
	function setUp() {
		$(".card").appendTo(poolItemsContainer);
		$(".card").off('click');
		//$(".items-data .card-img-overlay").show();

		updateOverlay();

		$(".card" ).one('click', function selectCard() {
			var id = $(this).attr('id');
			// console.log(data[id].gold.total, availableGold)
			if( data[id].gold.total <= availableGold) {
				selectedItems.push(id);
				poolItems.splice(poolItems.indexOf(id), 1);
				// console.log(selectedItems);
				$(this).appendTo(selectedItemsContainer);
				availableGold -= data[id].gold.total;
				availableGoldContainer.text(availableGold)
				updateOverlay();
				$(this).one('click', function removeCard() {
					var id = $(this).attr('id');
					availableGold += data[id].gold.total;
					availableGoldContainer.text(availableGold)
					$(this).appendTo(poolItemsContainer);
					selectedItems.splice(selectedItems.indexOf(id, 1));
					poolItems.push(id);
					updateOverlay();
					// console.log(selectedItems);
				});
			}
		});
	}

	function updateOverlay() {
		console.log(selectedItems);
		for(var i in poolItems) {
			var id = poolItems[i];

			if( data[id].gold.total <= availableGold ) {
				$("#" + id + " .card-img-overlay").hide();
			} else {
				console.log("Removed: " + id)
				$("#" + id + " .card-img-overlay").show();
			}
		}
	}
}

