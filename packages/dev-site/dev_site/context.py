from django.template import RequestContext

def admin_ctx(request):
    ctx = RequestContext(request)
    return {
        'foo': 'bar'
    }
