from django.urls import path
from .views import RegisterUserView, UserListView, CheckMembershipView  

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('check-membership/', CheckMembershipView.as_view(), name='check-membership'),  
    path('', UserListView.as_view(), name='user-list'),
]