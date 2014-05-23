require 'spec_helper'

# This spec was generated by rspec-rails when you ran the scaffold generator.
# It demonstrates how one might use RSpec to specify the controller code that
# was generated by Rails when you ran the scaffold generator.
#
# It assumes that the implementation code is generated by the rails scaffold
# generator.  If you are using any extension libraries to generate different
# controller code, this generated spec may or may not pass.
#
# It only uses APIs available in rails and/or rspec-rails.  There are a number
# of tools you can use to make these specs even more expressive, but we're
# sticking to rails and rspec-rails APIs to keep things simple and stable.
#
# Compared to earlier versions of this generator, there is very limited use of
# stubs and message expectations in this spec.  Stubs are only used when there
# is no simpler way to get a handle on the object needed for the example.
# Message expectations are only used when there is no simpler way to specify
# that an instance is receiving a specific message.

describe EntityTypeIconsController do

  # This should return the minimal set of attributes required to create a valid
  # EntityTypeIcon. As you add validations to EntityTypeIcon, be sure to
  # adjust the attributes here as well.
  let(:valid_attributes) { { "name" => "MyString" } }

  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # EntityTypeIconsController. Be sure to keep this updated too.
  let(:valid_session) { {} }

  describe "GET index" do
    it "assigns all entity_type_icons as @entity_type_icons" do
      entity_type_icon = EntityTypeIcon.create! valid_attributes
      get :index, {}, valid_session
      assigns(:entity_type_icons).should eq([entity_type_icon])
    end
  end

  describe "GET show" do
    it "assigns the requested entity_type_icon as @entity_type_icon" do
      entity_type_icon = EntityTypeIcon.create! valid_attributes
      get :show, {id: entity_type_icon.to_param}, valid_session
      assigns(:entity_type_icon).should eq(entity_type_icon)
    end
  end

  describe "GET new" do
    it "assigns a new entity_type_icon as @entity_type_icon" do
      get :new, {}, valid_session
      assigns(:entity_type_icon).should be_a_new(EntityTypeIcon)
    end
  end

  describe "GET edit" do
    it "assigns the requested entity_type_icon as @entity_type_icon" do
      entity_type_icon = EntityTypeIcon.create! valid_attributes
      get :edit, {id: entity_type_icon.to_param}, valid_session
      assigns(:entity_type_icon).should eq(entity_type_icon)
    end
  end

  describe "POST create" do
    describe "with valid params" do
      it "creates a new EntityTypeIcon" do
        expect {
          post :create, {entity_type_icon: valid_attributes}, valid_session
        }.to change(EntityTypeIcon, :count).by(1)
      end

      it "assigns a newly created entity_type_icon as @entity_type_icon" do
        post :create, {entity_type_icon: valid_attributes}, valid_session
        assigns(:entity_type_icon).should be_a(EntityTypeIcon)
        assigns(:entity_type_icon).should be_persisted
      end

      it "redirects to the created entity_type_icon" do
        post :create, {entity_type_icon: valid_attributes}, valid_session
        response.should redirect_to(EntityTypeIcon.last)
      end
    end

    describe "with invalid params" do
      it "assigns a newly created but unsaved entity_type_icon as @entity_type_icon" do
        # Trigger the behavior that occurs when invalid params are submitted
        EntityTypeIcon.any_instance.stub(:save).and_return(false)
        post :create, {entity_type_icon: { "name" => "invalid value" }}, valid_session
        assigns(:entity_type_icon).should be_a_new(EntityTypeIcon)
      end

      it "re-renders the 'new' template" do
        # Trigger the behavior that occurs when invalid params are submitted
        EntityTypeIcon.any_instance.stub(:save).and_return(false)
        post :create, {entity_type_icon: { "name" => "invalid value" }}, valid_session
        response.should render_template("new")
      end
    end
  end

  describe "PUT update" do
    describe "with valid params" do
      it "updates the requested entity_type_icon" do
        entity_type_icon = EntityTypeIcon.create! valid_attributes
        # Assuming there are no other entity_type_icons in the database, this
        # specifies that the EntityTypeIcon created on the previous line
        # receives the :update_attributes message with whatever params are
        # submitted in the request.
        EntityTypeIcon.any_instance.should_receive(:update).with({ "name" => "MyString" })
        put :update, {id: entity_type_icon.to_param, entity_type_icon: { "name" => "MyString" }}, valid_session
      end

      it "assigns the requested entity_type_icon as @entity_type_icon" do
        entity_type_icon = EntityTypeIcon.create! valid_attributes
        put :update, {id: entity_type_icon.to_param, entity_type_icon: valid_attributes}, valid_session
        assigns(:entity_type_icon).should eq(entity_type_icon)
      end

      it "redirects to the entity_type_icon" do
        entity_type_icon = EntityTypeIcon.create! valid_attributes
        put :update, {id: entity_type_icon.to_param, entity_type_icon: valid_attributes}, valid_session
        response.should redirect_to(entity_type_icon)
      end
    end

    describe "with invalid params" do
      it "assigns the entity_type_icon as @entity_type_icon" do
        entity_type_icon = EntityTypeIcon.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        EntityTypeIcon.any_instance.stub(:save).and_return(false)
        put :update, {id: entity_type_icon.to_param, entity_type_icon: { "name" => "invalid value" }}, valid_session
        assigns(:entity_type_icon).should eq(entity_type_icon)
      end

      it "re-renders the 'edit' template" do
        entity_type_icon = EntityTypeIcon.create! valid_attributes
        # Trigger the behavior that occurs when invalid params are submitted
        EntityTypeIcon.any_instance.stub(:save).and_return(false)
        put :update, {id: entity_type_icon.to_param, entity_type_icon: { "name" => "invalid value" }}, valid_session
        response.should render_template("edit")
      end
    end
  end

  describe "DELETE destroy" do
    it "destroys the requested entity_type_icon" do
      entity_type_icon = EntityTypeIcon.create! valid_attributes
      expect {
        delete :destroy, {id: entity_type_icon.to_param}, valid_session
      }.to change(EntityTypeIcon, :count).by(-1)
    end

    it "redirects to the entity_type_icons list" do
      entity_type_icon = EntityTypeIcon.create! valid_attributes
      delete :destroy, {id: entity_type_icon.to_param}, valid_session
      response.should redirect_to(entity_type_icons_url)
    end
  end

end
