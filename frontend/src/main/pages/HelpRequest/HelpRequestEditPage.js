import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import HelpRequestForm from 'main/components/HelpRequest/HelpRequestForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function HelpRequestEditPage() {

  // Stryker disable all : placeholder for future implementation
  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit page not yet implemented</h1>
      </div>
    </BasicLayout>
  )
}
