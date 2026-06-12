from django.urls import path
from .click_views import ClickWebhookView
from .payme_views import PaymeWebhookView


urlpatterns = [
    path('click/webhook/', ClickWebhookView.as_view(), name='click-webhook'),
    path('payme/webhook/', PaymeWebhookView.as_view(), name='payme-webhook'),
]