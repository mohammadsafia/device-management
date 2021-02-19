import { RequestHandler } from 'express';
import { UserRoles } from '../../interfaces';
import Assignment from '../../models/AssignmentModels';
import { InternalError, IsAdminOrMaintainer } from '../../utils';
class AssignmentController {
  public AssignDevice: RequestHandler = async (request, response, next): Promise<void> => {
    await IsAdminOrMaintainer(request, next, [UserRoles.Admin]);
    try {
     
    } catch (err) {
      throw InternalError(next, "Fetching users failed, please try again later.", 500)
    }
  } 
}


export default new AssignmentController();