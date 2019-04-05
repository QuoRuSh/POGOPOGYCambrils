map.on('click', function(e) {
  var popup = L.popup().setLatLng(e.latlng)
      .setContent(e.latlng.lat.toFixed(5)+", "+e.latlng.lng.toFixed(5))
      .openOn(map);
});

// time nidos dias ---------------------
var deadline = 'Oct 5 2017 0:00:00 GMT';
if (deadline == '') { deadline = base_deadline; }
var date_clock = get_recurring_week_day_v2(deadline, 2);
// initializeClock('remainingtext', date_clock, 0, '');
var timee = Date.parse(date_clock);

console.log(timee)
// time nidos---------------------
function getTimeRemaining(endtime){
          var t = Date.parse(endtime) - Date.parse(new Date());
          var seconds = Math.floor( (t/1000) % 60 );
          var minutes = Math.floor( (t/1000/60) % 60 );
          var hours = Math.floor( (t/(1000*60*60)) % 24 );
          var days = Math.floor( t/(1000*60*60*24) );
          return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
          };
        }
function get_recurring_week_day_v2(start_day, week_skip, count_today) {

  var input_date = new Date(start_day); //alert(input_date);
  var today = new Date(); //alert(today); //Get todays date

  var days = (week_skip * 7);
  var temp_date = new Date(input_date);
  temp_date.setDate(temp_date.getDate() + days); //alert(temp_date);
  while (temp_date < today) { 
    temp_date.setDate(temp_date.getDate() + days);
  }
  return temp_date;
}
// ---------------------------

var nearby = [];
var immediate = [];
var pokemonPNG = [];
var pokemon2 = [
    ["133","p133","EEVEE",41.48214, 2.33112],
    ["123","p123","SCYTHER",41.48220, 2.32884],
    ["213","p213","SHUCKLE",41.48230, 2.32531],
];
var PokemonIdList={"EEVEE":133,"SCYTHER":'123',"SHUCKLE":'213'};
var pokemonNames={133:'Eevee','123':'Scyther','213':'Shuckle'};

var pok;
var JSONoriginal = '{"result":[';
  for (pok in pokemon2) {
    JSONoriginal +='{"spawn_point_id":"'+pokemon2[pok][0]+'","encounter_id":"'+pokemon2[pok][1]+'","pokemon_id":"'+pokemon2[pok][2]+'","expiration_timestamp_ms":"'+timee+'","latitude":'+pokemon2[pok][3]+',"longitude":'+pokemon2[pok][4]+'},'
  }
    JSONoriginal +='{},{}]}';
var pokemon = JSON.parse(JSONoriginal);


// pokeSpawn ------------------------------
var LeafIcon = L.Icon.extend({
    options: {
      iconSize:     [50, 50],
      popupAnchor:  [0, -16]
    }
});
var pokemon1 = [
    ["417","417","Pachirisu",53.547310, -113.534225],
    ["455","455","Carnivine",30.332212,-81.655731],
    ["122","122","Mr.Mime",41.48297, 2.32384],
    ["441","441","Chatot",-23.5848435,-46.6559132],
    ["214","214","Heracross",-23.583768,-46.661171],
    // ["369","369","Relicanth",-41.33150051905472,174.8302646757152],
    ["369","369","Relicanth",-36.840752,174.765015],
    ["324","324","Torkoal",28.590581092991236,77.24265351891518],
    ["357","357","Tropius",-33.925449,18.423904],
    ["441","441","Chatot",-33.92654, 18.41791],
    ["83","083","Farfetch-d",35.6961,139.8144],
];
var pokenido;
for (var i = 0; i < pokemon1.length; i++) {
      pokenido = new L.marker([pokemon1[i][3],pokemon1[i][4]],{
        icon: new LeafIcon({iconUrl: 'http://www.serebii.net/pokemongo/pokemon/'+pokemon1[i][1]+'.png'})
      })
        .bindPopup('<h1>'+[pokemon1[i][2]]+' '+[pokemon1[i][0]]+'</h3>'+
        " <h3><a href='http://maps.google.com/maps?q="+[pokemon1[i][3]]+","+[pokemon1[i][4]]+"'>"+[pokemon1[i][3]]+", "+[pokemon1[i][4]]+"</a></h3>"+
        '<div class="remainingtext2" data-expire="'+timee+'"></div>'
        ).addTo(spawn);//spawn '+Date.parse(date_clock)+'
    }
// fin pokespawn ------------------------------------


  //encounter_ids are unique to each spawned pokemon, use these to look for & remove duplicates
  for(var x=0; x <= pokemon.result.length-1; x++){
    var aPokemon = {
        pokemon_id: pokemon.result[x].pokemon_id,
        encounter_id: pokemon.result[x].encounter_id,
        expiration_timestamp_ms: pokemon.result[x].expiration_timestamp_ms,
        latitude: pokemon.result[x].latitude,
        longitude: pokemon.result[x].longitude
                };
        if(pokemon.result[x].expiration_timestamp_ms === undefined){
            //Check if pokemon's already been put into nearby array, if so then we don't need to do anything
            var a = nearby.filter(function(a){
              return a.encounter_id === aPokemon.encounter_id;
              })[0] || immediate.filter(function(a){
              return a.encounter_id === aPokemon.encounter_id;
              })[0];
            if(a === undefined){
                //Put in nearby Array because we don't have a location
                nearby.push(aPokemon);
            }
        }else{
            //Check if pokemon's already been put into nearby array, if so then remove it from there
            var b = nearby.filter(function(b){
                return b.encounter_id === aPokemon.encounter_id;
                })[0];
            if(b !== undefined){
                nearby.splice(nearby.indexOf(b),1);
            }
            //Check if pokemon's already been put into immediate array, if so then we don't need to do anything
            var c = immediate.filter(function(c){
                return c.encounter_id === aPokemon.encounter_id;
                })[0];
            if(c === undefined){
                //Put it in immediate Array because we can locate & display them
                immediate.push(aPokemon);
            }
    }
  }

  //This is where we get all of the pokemon icons & populate pokemonPNG[] with the base64 string
  $.get("https://gist.githubusercontent.com/anonymous/50c284e815df6c81aa53497a305a29f2/raw", function(data) { //Init map
        var pokemons = data.split("\n");
        var i;
        for (i in pokemons) {
            var pokemondata = pokemons[i].split(":");
            if (pokemondata.length == 2) {
                pokemonPNG[pokemondata[0]] = pokemondata[1];
                //console.log(pokemonPNG[pokemondata[0]]);
            };
        }

    //This loop will display the info of each discovered pokemon within in the area
    for(var v=0; v <= immediate.length-1; v++){
      //Use this loop,the coords, and expiration times of each pokemon to create the custom pokemarkers on the map
      //createPokeIcon(immediate[v].pokemon_id, immediate[v].expiration_timestamp_ms);
      addPokemonToMap(immediate[v])
      //document.getElementById("test").innerHTML = document.getElementById("test").innerHTML + '<br>' + '<img src="data:image/png;base64,' + pokemonPNG[PokemonIdList[immediate[v].name]] + '" />' + immediate[v].name + ' - ei:' + immediate[v].encounter_id;
        }

    //This loop will display the images of all pokemon that is nearby that we don't have coords for
        for(var q=0; q <= nearby.length-1; q++){
      //Use this loop to display a list of images of each pokemon that is nearby that we don't know the exact location of

      //esto--> document.getElementById("test2").innerHTML = document.getElementById("test2").innerHTML + '<br>' + '<img src="data:image/png;base64,' + pokemonPNG[PokemonIdList[nearby[q].pokemon_id]] + '" />' + nearby[q].pokemon_id + ' - ei:' + nearby[q].encounter_id;

        }
    });

var shownMarker = [];

L.HtmlIcon = L.Icon.extend({
    options: {},

    initialize: function(options) {
        L.Util.setOptions(this, options);
    },

    createIcon: function() {
        var div = document.createElement('div');
    div.innerHTML =
      '<div class="displaypokemon" data-pokeid="' + this.options.pokemonid  + '">' +
      '<div class="pokeimg">' +
      '<img src="https://www.serebii.net/pokemongo/pokemon/'+this.options.pokemonid+'.png" height="50"/>'+
      '</div>' +
      '<div class="remainingtext" data-expire="' + this.options.expire + '"></div>' +
      '</div>';
      return div;

    },
    createShadow: function() {return null;}
});

var map;
function deleteDespawnedPokemon() {
    var j;
    for (j in shownMarker) {
        var active = shownMarker[j].active;
        var expire = shownMarker[j].expire;
        var now = Date.now();
        if (active == true && expire <= now) {
            map.removeLayer(shownMarker[j].marker);
            shownMarker[j].active = false;
        }
    }
}
function createPokeIcon(pokemonid, timestamp) {
    return new L.HtmlIcon({
        pokemonid: pokemonid,
        expire: timestamp,
    });
}
function addPokemonToMap(spawn) {
    var j;
    var toAdd = true;
    if (spawn.expiration_timestamp_ms <= 0){
        spawn.expiration_timestamp_ms = Date.now() + 930000;
    }
    for (j in shownMarker) {
        if (shownMarker[j].id == spawn.encounter_id) {
            toAdd = false;
            break
        }
    }
    if (toAdd) {
        var cp = new L.LatLng(spawn.latitude, spawn.longitude);
        var pokeid = PokemonIdList[spawn.pokemon_id];
        var pokenombre = pokemonNames[pokeid];
        var pokeMarker = new L.marker(cp, {
            icon: createPokeIcon(pokeid, spawn.expiration_timestamp_ms)
        });
        shownMarker.push({
            marker: pokeMarker,
            expire: spawn.expiration_timestamp_ms,
            id: spawn.encounter_id,
            active: true
        });
        map.addLayer(pokeMarker);
        pokeMarker.setLatLng(cp);
        pokeMarker.bindPopup('<h1>'+pokenombre+'</h1><p>'+cp.lat+', '+cp.lng+'</p>');
    }
}

//TODO:<--Timer Functions-->//
function component(x, v) {return Math.floor(x / v);}
function calculateRemainingTime(element) {
    
    var $element = $(element);
    var ts = ($element.data("expire") / 1000 | 0) - (Date.now() / 1000 | 0);
    var minutes = component(ts, 60) % 60,
        seconds = component(ts, 1) % 60;
    if (seconds < 10)
        seconds = '0' + seconds;
    $element.html(minutes + ":" + seconds);
}

function calculateRemainingTime2(element) {

  let days, hours, minutes1, seconds1;
  element = new Date(element).getTime();
  
  if (isNaN(element)) { return; }
  setInterval(calculate, 1000);
  
  function calculate() {

    let startDate = new Date();
    startDate = startDate.getTime();    
    let timeRemaining = parseInt((element - startDate) / 1000);
    
    if (timeRemaining >= 0) {
      days = parseInt(timeRemaining / 86400);
      timeRemaining = (timeRemaining % 86400);
      
      hours = parseInt(timeRemaining / 3600);
      timeRemaining = (timeRemaining % 3600);
      
      minutes1 = parseInt(timeRemaining / 60);
      timeRemaining = (timeRemaining % 60);
      
      seconds1 = parseInt(timeRemaining);

      var ds = parseInt(days, 10);
      var hr = ("0" + hours).slice(-2);
      var ms = ("0" + minutes1).slice(-2);
      var sd = ("0" + seconds1).slice(-2);

      $(".remainingtext2").html(ds+ "d " +hr+ "h " +ms+ ":" +sd);
      //document.getElementById("expire").innerHTML = ds+'d '+hr+'h '+ms+':'+sd
      
    } else { return; }
  }

}

function updateTime() {
    deleteDespawnedPokemon();
    $(".remainingtext").each(function() {
        calculateRemainingTime(this);
    });
    $(".remainingtext2").each(function() {
        calculateRemainingTime2(date_clock);
    });
}
setInterval(updateTime, 1000);
//<--End of timer functions-->//
