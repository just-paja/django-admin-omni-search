from django.template import RequestContext

def admin_ctx(request):
    ctx = RequestContext(request)
    print(ctx, flush=True)
    return {
        'foo': 'bar'
    }
