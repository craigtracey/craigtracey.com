{% if site.hubspot_portal %}
<script type="text/javascript">
    (function(d,s,i,r) {
        if (d.getElementById(i)){return;}
        var n=d.createElement(s),e=d.getElementsByTagName(s)[0];
        n.id=i;n.src='//js.hubspot.com/analytics/'+(Math.ceil(new Date()/r)*r)+'/{{ site.hubspot_portal }}.js';
        e.parentNode.insertBefore(n, e);
    })(document,"script","hs-analytics",300000);
</script>
{% endif %}
