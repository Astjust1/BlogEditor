//Document Ready Type ish
 $(function(){
     //console.log("helloo");
    //Grab repo content
    $("body").on('click',"#content_id",function(e){
        //console.log("WTF");
        //console.log($(this));
        e.preventDefault();
        //console.log("yo");
        var contentUrl = $(this).attr('url');
        console.log(contentUrl);
        var data = {
          url : contentUrl
        };
        //console.log(data);
        
        $.ajax({
                'type' : 'post',
                'url' : '/content/fetch',
                'data' : data
            })
            .done(function(d){
                window.location.assign(d.redirect);
               // console.log("here");
               // console.log(d);
            })
            .fail(function(d){
                console.log(d);
            });
        
        });
    

    //Grab file content (Comes in as base64 encoded blob)
    $("body").on('click',"#content_info",function(e){
        e.preventDefault();
        //console.log("yo");
        var contentUrl = $(this).attr('url');
        console.log(contentUrl);
        var data = {
          url : contentUrl
        };
        $.ajax({
                'type' : 'post',
                'url' : '/editor/fetch',
                'data' : data
            })
            .done(function(d){
                window.location.assign(d.redirect);
            })
            .fail(function(d){
                console.log(d);
            });
        
        });

});

//Markdown convert
function convert(){
    var source = document.getElementById('source');
    var text = source.value,
        target = document.getElementById('targetDiv'),
        converter = new showdown.Converter(),
        html = converter.makeHtml(text);

        target.innerHTML = html;
        source.hidden = true;
        target.hidden = false;

};

//markdown hide
function hideMarkdown(){
    var source = document.getElementById('source');
    var target = document.getElementById('targetDiv');
    target.hidden = true;
    source.hidden = false;
}