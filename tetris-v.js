grid_size = 30;
field_width_grid = 10;
field_height_grid = 20;
field_width  = field_width_grid*grid_size;
field_height = field_height_grid*grid_size;
next_block_field_width_grid = 5;
next_block_field_height_grid = 5;
render_step = 400;
ready = true;
score = 0;
number_shift_this_turn = 0;
$(document).ready(function(){
	blocks = set_blocks();
	field  = set_field();
	firebase();
	ctx = $("#player_field")[0].getContext('2d');
	next_ctx = $("#next_player_block")[0].getContext('2d');
	saved_ctx = $("#saved_player_block")[0].getContext('2d');
	draw_field(ctx,field);
	player_block = generate_player_block();
	next_player_block = generate_player_block();
	saved_player_block = 'empty';
	var interval = setInterval(update=function(){
		update_player_block(player_block);
		if(check_player_block_collide(player_block,field)){	
			if(!check_alive(player_block,field)) alert('You Lose');
			player_block_to_field(player_block,field);
			player_block =  clone(next_player_block);
			next_player_block = generate_player_block();
			number_shift_this_turn = 0;
		}
		field = clear_field(field);
		draw(ctx,next_ctx,player_block,next_player_block,field);
		},
		render_step);

	function draw(ctx,next_ctx,player_block,next_player_block,field,saved_player_block){
		player_block_shadow = player_block_bottom(player_block,field);
		draw_field(ctx,field);
		draw_player_block(ctx,player_block);
		draw_player_block_shadow(ctx,player_block_shadow,field);
		draw_next_player_block(next_ctx,next_player_block,'Next');
		if(saved_player_block != 'empty') draw_next_player_block(saved_ctx,saved_player_block,'Saved');
	}

	$(document).keydown(function(e){
		switch(e.keyCode)
		{
			case 37: //left
				actionLeft(player_block,field);
				break;
			case 39: //right
				actionRight(player_block,field);
				break;
			case 40: //down
				actionDown();
				break;
			case 90: //z
				actionFlipLeft(player_block,field);	
				break;
			case 88: //x
				actionFlipRight(player_block,field);
				break;
			case 32: //space
				actionSpace();
				break;
			case 16: //shift
				actionShift();
			case 187: //=
				actionCheat(player_block,field);
				break;
			default:
				console.log('Key Pressed Code : '+ e.keyCode.toString());
		}
		draw(ctx,next_ctx,player_block,next_player_block,field,saved_player_block);
	});

	function actionCheat(){
		console.log("enter cheat");
		c = new Array(field_width_grid);
		min_y=25;
		max_y=-5;
		for(var j=0;j<field_width_grid;j++){
			var k;
			for(var i=0;i<field_height_grid;i++){
				if(field[i][j].occupy) break;
				k=i;
			}
			if(min_y>k) min_y=k;
			if(max_y<k) max_y=k;
			c[j]=k;
		}
		cheat_shape = new Array(max_y+1);
		for(var i=0;i<max_y+1;i++){
			cheat_shape[i] = new Array(); 
			for(var j=0;j<field_width_grid;j++){
				if(c[j]-max_y > i+1) cheat_shape[i].push(1)
				else cheat_shape[i].push(0);
			}
		}

		player_block = {
					block:{
					shape: cheat_shape, 
					color:'Green',
					type:'Cheat'
			 		},
					x:0,
					y:player_block.y
				};
	}

	function actionSpace(){
		player_block = player_block_bottom(player_block,field);
		player_block.y+=1;
		player_block_to_field(player_block,field);
		player_block = clone(next_player_block);
		next_player_block = generate_player_block();
		number_shift_this_turn = 0;

	}
	function actionLeft(player_block,field){
		player_block.x-=1;
		if(check_player_block_collide(player_block,field)) player_block.x+=1;
	}

	function actionDown(){
		update();
	}
	function actionRight(player_block,field){
		player_block.x+=1;
		if(check_player_block_collide(player_block,field)) player_block.x-=1;
	}

	function actionFlipLeft(player_block,field){
		tmp_shape = copy_array(player_block.block.shape);
		transform_block_shape(player_block.block,false);
		shift_player_block_inside_wall(player_block);
		if(check_player_block_collide(player_block,field)) player_block.block.shape = tmp_shape;
	}

	function actionFlipRight(player_block,field){
		tmp_shape = copy_array(player_block.block.shape);
		transform_block_shape(player_block.block,true);
		shift_player_block_inside_wall(player_block);
		if(check_player_block_collide(player_block,field)) player_block.block.shape = tmp_shape;
	}

	function actionShift(){
		if(saved_player_block != 'empty' && number_shift_this_turn<3){
			number_shift_this_turn+=1;
			tmp_x = player_block.x;
			tmp_y = player_block.y;
			tmp_block = clone(saved_player_block);
			saved_player_block = clone(player_block);
			player_block = clone(tmp_block);
			player_block.x = tmp_x;
			player_block.y = tmp_y;
		}
		if(saved_player_block == 'empty')
		{
			saved_player_block = clone(player_block);
			player_block =  clone(next_player_block);
			next_player_block = generate_player_block();
			number_shift_this_turn = 0;
		}
	}

});


function copy_array(arr){
    var new_arr = arr.slice(0);
    for(var i = new_arr.length; i--;)
        if(new_arr[i] instanceof Array)
            new_arr[i] = copy_array(new_arr[i]);
    return new_arr;
}

function clone(o){
	return jQuery.extend(true, {}, o);
}

function firebase(){
	var myRootRef = new Firebase('https://tetris-firebase.firebaseIO.com//');
	myRootRef.set('Hello World!');
}