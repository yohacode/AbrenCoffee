from .models import PageVisit

class PageVisitLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Avoid tracking admin and static/media files
        if request.path.startswith('/admin/') or request.path.startswith('/static/') or request.path.startswith('/media/'):
            return response

        # Only track GET requests (avoid tracking POST/PUT)
        if request.method == 'GET':
            session_key = request.session.session_key
            if not session_key:
                request.session.create()  # create session if not exists
                session_key = request.session.session_key

            PageVisit.objects.create(
                user=request.user if request.user.is_authenticated else None,
                session_key=session_key,
                path=request.path,
                ip_address=get_client_ip(request),
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                referrer=request.META.get('HTTP_REFERER', '')
            )

        return response

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
