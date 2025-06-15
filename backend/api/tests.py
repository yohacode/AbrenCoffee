from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from users.models import CustomUser

class AccountsViewsTestCase(TestCase):
    def setUp(self):
        self.username = 'admin'
        self.password = "adminpass"
        self.user = CustomUser.objects.create_superuser(username=self.username, password=self.password)
        self.login_url = reverse("token_obtain_pair")  # match this to your URLConf

    def test_auth_status_admin_session(self):
        login_success = self.client.login(username=self.username, password=self.password)
        self.assertTrue(login_success, "Admin login failed")

    def test_login_success(self):
        response = self.client.post(self.login_url, {
            "username": self.username,
            "password": self.password
        }, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, f"Response data: {response.data}")

    def test_login_invalid_credentials(self):
        response = self.client.post(self.login_url, {
            "username": self.username,
            "password": "wrongpass"
        }, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED, f"Response data: {response.data}")

    def test_login_success_with_username(self):
        response = self.client.post(self.login_url, {
            "username": self.username,
            "password": self.password
        }, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK, f"Response data: {response.data}")

    def test_logout_success(self):
        login_response = self.client.post(self.login_url, {
            "username": self.username,
            "password": self.password
        }, content_type="application/json")
        self.assertEqual(login_response.status_code, status.HTTP_200_OK, f"Login response: {login_response.data}")

        refresh = login_response.data.get("refresh")
        response = self.client.post("/api/logout/", {
            "refresh": refresh
        }, content_type="application/json")

        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)
