import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Maintenance() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-2xl mx-4 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="text-center">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                <div className="relative bg-blue-500 rounded-full p-6">
                  <Wrench className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>

            {/* Status Code */}
            <div className="mb-4">
              <span className="text-6xl font-bold text-gray-900">503</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Under Maintenance
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
              We're currently performing scheduled maintenance to improve your experience. 
              We'll be back soon!
            </p>

            {/* Icon List */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 text-gray-600">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Scheduled Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span className="text-sm">We'll notify you when done</span>
              </div>
            </div>

            {/* Estimated Time */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Estimated completion:</strong> Please check back soon
              </p>
            </div>

            {/* Contact Option */}
            <div className="mt-8">
              <Button 
                onClick={() => window.location.href = 'mailto:info@unitedbethel.org'}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <Mail className="h-4 w-4" />
                Contact Us
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

