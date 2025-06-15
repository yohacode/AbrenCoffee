from django.shortcuts import render
from django.views.generic import TemplateView

class FrontendView(TemplateView):
    template_name = 'index.html'

    def get_template_names(self):
        return [self.template_name]
